# noijs
`noijs` is a library that helps you scaffold files using templates you define. Its aim is to be a simple solution, that allows you to define a template in a couple of minutes and automate some of the work you have to do as a software developer.

### Why using it?
I'm super lazy, and I hate doing repetitive work. If it can be automated, it should be. This is the main motivation behind `noijs`. I realized that there were some things that I always had to do pretty much every day at work. Let me give you a few examples:

- Creating components when working on a react app.
- Implementing new endpoints when working in the backend.
- Integrating said components to request the data from those endpoints.

If you think of it, usually these files have a very well defined structure. For example, a react component would look something like:

```tsx
import {FC} from 'react';
import classNames from 'classnames';

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

Your component structure may differ a little bit, but the basic structure of all components is always the same. The same concept applies to endpoints, scheduled jobs, automated scripts you may have, and so on.

Thing is, it is really boring writing all this stuff, mostly when you're starting a project, because you'll be doing this a lot.

That's why I created `noijs`, to be able to automate this process and just focus on writing the business logic.

### Installation
You wanna try it? Simply run:
```bash
npm install -g noijs
```
That's it. Make sure you've added your `$HOME/.npm-global/bin` (or whatever your global npm directory is) to the $PATH variable. Once you do this, you should be able to run:
```bash
noi
```
And you should see `No templates found` in the screen. If you see it, then your can move on to the next section.

## Creating templates
Let's create a template for a react component. Start by creating a `.noi` directory somewhere. You can add it in your project root if these templates are project-specific, or you can add them to `~/.noi` and they'll be available to all projects.

The file structure for a noi template looks something like this:
```bash
.noi
  |__ react-component
       |__ config.js
       |__ templates
            |__ component.template
```

The `templates` directory should contain one template for each file that this noi config will create. In this case, we simply want it to create the `MyComponent.tsx` and `MyComponent.less` files.

The `config.js` file allows you to define wizzard-like prompts for the user to enter information, like the component name and any other value you may need to render your template.

A config file for our react component template would look something like this:
```js
module.exports = {
  params: {
    properties: {
      componentName: {
        description: 'Enter a name for the component (e.g. LoginForm)`,
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

That's it, we're done defining our first noit template.

Now if you run `noi ls` you should see:
```bash
Available templates: 
react-component
```

## Executing a noi config
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

## Utility Functions

#### noi.file(filePath, content)
Creates a new file with the given content.

#### noi.fileFromTemplate({ template, data, dest })
Renders the template at the given `template` path using the `data` object as context. It then creates a new file in the `dest` path with the rendered template.

#### noi.exists(path)
Returns a boolean indicating whether the file exists or not.

#### noi.appendToFile(filePath, content)
Appends the given content to the end of the file.

#### noi.appendTemplateToFile({ template, data, file })
Renders the `template` using the given `data` and appends it at the end of the given `file` path.

#### noi.exec(cmd)
[Async] Executes the given command. It returns a promise that resolves to the `stdout`.

#### noi.cd(path)
Changes the current working directory to the given path.

#### noi.mkdir(path)
[Async] Creates a new directory at the given path.

#### noi.cp(src, dest) 
[Async] Copies the `src` file to the `dest` path.