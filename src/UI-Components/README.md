# KattBNB own UI library, yay!

## Importing

`import { Header, Text, Container, InlineLink } from '../../../UI-Components';`

Always from the `UI-Components` folder directly
</br></br>

## Default props

All UI elements has a set of default props. That means it should work without passing in anything, like this:

`<Header>Hello World</Header>`

You can see what the defined default props are in the respective components `index.js`
</br></br>

## Passing in test id

Passing in test id like this:

`<Header data-cy-awesome-header>Hello World</Header>`

Renders following HTML output:

`<h1 color="base" data-cy-awesome-header="true" class="sc-crzoAE eFosKO">Hello World</h1>`

You can then retrieve the element via `cy.get('[data-cy-awesome-header]')`
</br></br>

## Changing UI components

UI library is not supposed to be changed frequently. Every change should be considered carefully. Make a separate pull request.
</br></br></br>

# Typography elemments

## Header

IMPORTANT! Only one first level header per page! This is neccesary for good SEO performance.
