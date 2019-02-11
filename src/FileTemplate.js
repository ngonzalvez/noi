const fs = require('fs');


class FileTemplate {
  constructor(filePath, params) {
    this.params = params;
    this.filePath = filePath;
    this.template = this.loadTemplate();
  }

  loadTemplate() {
    return fs.readFileSync(this.filePath).toString();
  }

  render() {
    let result = this.template;
    let regex = null;

    for (let param in this.params) {
      regex = new RegExp('{% *' + param + ' *%}', 'g');
      result = result.replace(regex, this.params[param]);
    }

    return result;
  }
}


module.exports = FileTemplate;
