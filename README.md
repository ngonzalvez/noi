<h3 align="center">noijs</h3>
<p align="center">Scaffold your project components using your own templates.</p>
<h1></h1>

&nbsp;
#### About the Project
[I'm super lazy](https://ncode.uy/being-lazy-is-ok), and I hate repetitive work. **If it can be automated, it should be**. This is the main motivation behind `noijs`. 

At work you'll find yourself:
- Creating **components** when working on a react app.
- Implementing new **endpoints** when working on an API.
- Data functions
- Shell scripts
- Scheduled jobs

If you think of it, usually these pieces of code have a very **well defined structure**. For example, a react component would look something like:

```tsx
import {FC} from 'react';
import classNames from 'classnames';
import styles from './MyComponent.module.scss';

interface MyComponentProps {
  className: string;
}

const MyComponent: FC<MyComponentProps> = ({ className }) => {
  return (
    <div className={classNames('MyComponent', className)}>
      Content here
    </div>
  );
}
```

And it also needs stylesheet and tests files. Creating the directory structure and every file by hand, and **writing all this stuff** over and over **is a waste of time**. Even more when starting a project from scratch, because **you'll be doing this a lot**.

`noijs` allows you to **automate** this process, so that you can **focus on writing the business logic**.

&nbsp;
#### Installation
Wanna try it? Simply run:
```bash
npm install -g noijs
```
That's it. Make sure you've added your `$HOME/.npm-global/bin` (or whatever your global npm directory is) to the $PATH variable. Once you do this, you should be able to run:
```bash
noi
```
And you should see `No templates found` in the screen. If you see it, then your can move on to the next section.

&nbsp;
#### Creating templates
Let's create a template for a react component. Start by creating a `.noi` directory somewhere. You can add it in your project root if these templates are project-specific, or you can add them to `~/.noi` and they'll be available to all projects.

The file structure for a noi template looks something like this:
```bash
.noi
  |__ react-component
       |__ config.js
       |__ templates
            |__ component.template
```

The `templates` directory should contain one template for each file this noi config will create. In this case, we simply want it to create the `MyComponent.tsx` file.

The `config.js` file allows you to define wizzard-like prompts for the user to enter information, like the component name and any other value you may need to render your template.

A config file for our react component template would look something like this:
```js
module.exports = {
  params: {
    properties: {
      componentName: {
        description: 'Enter a name for the component (e.g. LoginForm)',
        required: true
      }
    }
  },

  run(data, noi) {
    console.log(data.componentName);
  }
};
```

In the above code, we define a noi config file that simply defines one prompt for the user, asking them to enter a name for the component. The information the user inputs in these prompts will be available in the `data` parameter of the `run()` method.

Appart from the data collected from the prompts, the run function also receives an `noi` instance. This instance contains a bunch of utility functions to help you create directories, files, render templates, and other helpful actions. See the **Utility Functions** section.

Now let's render our templates and create our component file.

```ts
module.exports = {
  // ...
  run(data, noi) {
    const componentsDir = `${process.cwd()}/components`;

    noi.fileFromTemplate({
      template: '${__dirname}/templates/component',
      data: data,
      dest: `${componentsDir}/${data.componentName}.tsx`
    });
  }
}
```

Lastly, let's define our templates. To inject the data into the templates, simply use the `{% propName %}` syntax.

```tsx
// File: templates/component.template

import {FC} from 'react';
import classNames from 'classnames';
import './{% componentName %}.less';

interface {% componentName %}Props {
  className: string;
}

const MyComponent: FC<{% componentName %}Props> = ({ className }) => {
  return (
    <div className={classNames('{% componentName %}', className)}>
      Content here
    </div>
  );
}
```

```less
.{% componentName %} {
  // Styles go in here.
}
```

That's it, we're done defining our first noi template.

Now if you run `noi ls` you should see:
```bash
Available templates: 
react-component
```

&nbsp;
#### Executing a noi config
Now that you have a noi config, let's execute it. Simply `cd` into the directory containing the `components` folder and run:

```bash
noi react-component
```

You should see something like:
```bash
Enter a name for your component (e.g. LoginForm): 
```

Simply enter a name for the component and press `Enter`. Now, if you run `ls components` you should see the new component file.

Now you have automated the scaffolding of a simple react component. In this example we simply created one file, but in real-life examples you may be creating several files, appending some content to existing files, and so on.

&nbsp;
#### Utility Functions

```Javascript
noi.file(filePath, content)
```
Creates a new file with the given content.

&nbsp;
```Javascript
noi.fileFromTemplate({ template, data, dest })
```
Renders the template at the given `template` path using the `data` object as context. It then creates a new file in the `dest` path with the rendered template.

&nbsp;
```Javascript
noi.exists(path)
```
Returns a boolean indicating whether the file exists or not.

&nbsp;
```Javascript
noi.appendToFile(filePath, content)
```
Appends the given content to the end of the file.

&nbsp;
```Javascript
noi.appendTemplateToFile({ template, data, file })
```
Renders the `template` using the given `data` and appends it at the end of the given `file` path.

&nbsp;
```Javascript
noi.exec(cmd)
```
[Async] Executes the given command. It returns a promise that resolves to the `stdout`.

&nbsp;
```Javascript
noi.cd(path)
```
Changes the current working directory to the given path.

&nbsp;
```Javascript
noi.mkdir(path)
```
[Async] Creates a new directory at the given path.

&nbsp;
```Javascript
noi.cp(src, dest)
```
[Async] Copies the `src` file to the `dest` path.
