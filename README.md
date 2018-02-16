![Stencil Inspector](docs/logo.jpg?raw=true "Stencil Inspector")

Stencil Inspector is a Chrome plugin that adds a new inspector pane to the Elements panel, providing Stencil-specific information about selected elements.

You can inspect any type of data available: nodes, objects, functions, strings etc.

## Available Inspections
1. Props
   * name
   * value
   * observed flag
   * mutable flag
   * context flag
   * connect flag
   * controller of the prop

2. States
   * name
   * value

3. Methods
   * name
   * body

4. Listeners
   * event name
   * method name
   * method body
   
5. Class Instance
   * members name
   * members value

6. DOM Element
   * props

7. App Context
   * values

8. Defined Components
   * name
   * tag
   * bundle
   * styles flag
   * encapsulated flag
   * props
      * name
      * observed flag
      * mutable flag
      * context flag
      * connect flag
      * controller of the prop
   * states
   * methods
   * DOM elements
   * listeners
      * event name
      * method name

## Color Schemes
1. White
2. Dark

## Instructions
1. Clone the repo
2. Build the project using `npm run build`
2. Load unpacked extension in Chrome
3. Point to the `www` folder

## Screenshots
![Screenshot 1](docs/screenshot1.jpg?raw=true "Screenshot 1")
![Screenshot 2](docs/screenshot2.jpg?raw=true "Screenshot 2")
![Screenshot 3](docs/screenshot3.jpg?raw=true "Screenshot 3")
![Screenshot 4](docs/screenshot4.jpg?raw=true "Screenshot 4")

## Credits

* [Aurelia Inspector](https://github.com/aurelia/inspector)
* [Stencil Team](https://stenciljs.com/)
