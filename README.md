## Comic Relief Pattern Lab
> it's a node-based experimental project to supply sass component as well as styleguide generator

## The idea
To have a centralised hub supply common styling across CR products. 

## Styleguide
* generated by [kss-node](https://github.com/kss-node/kss-node)
* support twig template
* multiple entries
* view on
  - `/dist/index.html`
  - `/dist/[project_name]/index.html`

## Import styling to a project
* run `npm install @comicrelief/pattern-lab --save`
* on local scss file, add `@import '~pattern-lab';` 

  (or use `includePaths: ['node_modules']` in grunt-sass `options` configuration)
* or copy css file straight to your project 

## Contribute styling to pattern-lab
### Workflow 
#### Get it up and running!
* run `git clone https://github.com/comicrelief/pattern-lab pattern-lab`
* run `cd /[project-name]` go to project folder you want to include pattern-lab 
* run `npm install npm-link-local --save` 
* run `npm-link-local [path-to-pattern-lab]` it creates symlink of `./node_modules/pattern-lab`. It means whatever change on `/pattern-lab`, it will reflect on `[project-name]`
#### Make code changes
* it follows same development process: create feature branch -> commit and push changes -> create pull request for code review
* run `npm run watch` to liveload file changes
* run `npm run build` to generate styleguide

#### Deployment
* CI will excute `npm run deploy` once merged into `master`
* to bump npm version number and publish the package


## Semantic Relase Process
Git commit messages are used to automatically publish a new version of npm package. To achieve this, **every commit message**
should have a **type** and a **message** in the format described below.

CI will run a job automatically after PR is merged and analyze all commit messages since last npm release.
Then semantic-release plugin will calculate new version according to this result

Commit messages are expected to be in this format:
```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```
Minimally, only `type` and `subject` is required.

### Bugfix / patch
When there are no breaking changes or no new features. When we are fixing bugs or styles.
```
fix: A bug fix
```

### Minor / Feature
When there is a new feature / functionality is added to the library
```
feat: A new feature
```

### Major / breaking change
When there is a breaking change, we need to extend our commit message and add `BREAKING CHANGE: A 
description of the change` to its body. This message can be added to any type of commit. 
Example:
```
feat: A new feature

BREAKING CHANGE: A description of the change
```

### Automating commit message format
Commitizen library is added as npm dev dependency and it can be used to generate commit messages by 
answering a few questions and skipping the ones which are not relavent.
Example workflow:
- Make code changes in your feature branch
- Run **`git add .`** to add changed files and get ready to commit
- Run **`npm run commit`**
 
This will start an interactive process to build commit message. Simply answer all questions or
press `Enter` to skip.
 
 - Repeat and follow rest of the GitHub workflow