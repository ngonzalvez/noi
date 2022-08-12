const prompt = require("prompt");
const rl = require("readline");
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const changeCase = require("change-case");

const FileTemplate = require("./FileTemplate");

prompt.message = "";

const noi = {
  changeCase: changeCase,

  /**
   * Run the noi command-line tool.
   */
  cli(cmd) {
    if (cmd === "ls") {
      return noi.ls();
    }

    let configPath;
    let didFindConfig = false;

    while (process.cwd() !== "/") {
      configPath = path.join(
        process.cwd(),
        ".noi",
        ...cmd.split(","),
        "config.js"
      );

      if (fs.existsSync(configPath)) {
        didFindConfig = true;
        break;
      }

      process.chdir("../");
    }

    if (!didFindConfig) {
      console.log(
        "No configuration file found for the requested command. Make sure you have noi templates defined and that you are in the right directory."
      );
      process.exit();
    }

    const config = require(configPath);
    return prompt.get(config.params, (err, params) => {
      config.run(params, noi);
    });
  },

  ls() {
    const noiDirectory = path.join(process.cwd(), ".noi");
    const templates = new Set();

    while (process.cwd() !== "/") {
      if (fs.existsSync(noiDirectory)) {
        fs.readdirSync(noiDirectory, { withFileTypes: true }).forEach(
          (dirent) => {
            if (dirent.isDirectory()) templates.add(dirent.name);
          }
        );
      }

      process.chdir("../");
    }

    if (templates.size) {
      console.log("Available templates:");
      templates.forEach((templateName) => console.log(templateName));
    } else {
      console.log("No templates found");
    }
  },

  /**
   * Run a noi interpreter.
   */
  repl() {
    if (noi.rl === undefined) {
      noi.rl = rl.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
    }

    noi.rl.question("> ", (input) => {
      try {
        eval(input);
      } catch (err) {
        if (err) {
          console.error(err);
        }
      } finally {
        noi.repl();
      }
    });
  },

  /**
   * Create a new file with the given template.
   *
   * @param {string}   filePath  path for the new file.
   * @param {FileTemplate} template  the template for the new file.
   */
  file(filePath, content) {
    fs.writeFileSync(filePath, content, { flag: "w" });
  },

  fileFromTemplate({ dest, template, data }) {
    noi.file(dest, noi.template(template, data));
  },

  /**
   * Create a new directory.
   *
   * @param {string} dirPath   the path to the new directory.
   */
  dir(dirPath) {
    try {
      if (!noi.exists(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
    } catch (err) {
      console.log(err);
    }
  },

  exists(path) {
    return fs.existsSync(path);
  },

  /**
   * Append the given line to the file.
   *
   * @param {string} filePath  path to the file to be modified.
   * @param {string} line      the line to be appended.
   */
  line(filePath, line) {
    fs.appendFileSync(filePath, line);
  },

  /**
   * Create a new template with the contents of the given file and with the
   * given params.
   *
   * @param {string} filePath   path to the template file.
   * @param {object} params     parameters for rendering the template.
   *
   * @return {FileTemplate} the template instance.
   */
  template(filePath, params) {
    return new FileTemplate(filePath, params).render();
  },

  /**
   * Execute the given command.
   *
   * @param {string} cmd  A command to be executed.
   * @return {number} exit status.
   */
  async exec(cmd) {
    return new Promise((resolve, reject) => {
      execSync(cmd, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        }

        resolve(stdout, stderr);
      });
    });
  },

  /**
   * Change the current working directory to the given path.
   *
   * @param {string} dir  A valid path to an existing directory.
   */
  cd(dir) {
    process.chdir(dir);
    return noi;
  },

  /**
   * Create the given directory.
   *
   * @param {string} dirPath  path to the directory to be created.
   */
  async mkdir(dirPath) {
    await noi.exec(`mkdir -p ${dirPath}`);
  },

  /**
   * Copy the given files into the destination path.
   *
   * @param {string} src files or directories to copy.
   * @param {string} dst path to destination directory.
   */
  cp(src, dst) {
    noi.exec(`cp -r ${src} ${dst}`).catch((err) => {
      if (err) {
        console.error(err);
      }
    });
  },
};

module.exports = noi;
