<div id="top"></div>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://ux-dev.canonizer.com">
    <img src="https://canonizer.com/images/logo.svg" alt="Logo" width="150">
  </a>
  <h3 align="center">Canonizer-3.0-Frontend</h3>

  <p align="center">
    <br />
    <a href="https://ux-dev.canonizer.com/" style="color: #FFF;">View Demo</a>
    ·
    <a href="https://github.com/the-canonizer/canonizer-3.0-frontend/issues" style="color: #FFF;">Report Bug</a>
    ·
    <a href="https://github.com/the-canonizer/canonizer-3.0-frontend/issues" style="color: #FFF;">Request New Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li>
      <a href="#contributing">Contributing</a>
      <ul>
        <li><a href="#create-a-branch">Create a branch</a></li>
        <li><a href="#make-the-change">Make the change</a></li>
        <li><a href="#test-the-change">Test the change</a></li>
        <li><a href="#push-the-change">Push the change</a></li>
      </ul>
    </li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

[![Product Name Screen Shot][product-screenshot]](https://ux-dev.canonizer.com)

A wiki system that solves the critical liabilities of Wikipedia. It solves petty "edit wars" by providing contributors the ability to create and join camps and present their views without having them immediately erased. It also provides ways to standardize definitions and vocabulary, especially important in new fields.

<p align="right">(<a href="#top">back to top</a>)</p>

### Built With

- [Next.js](https://nextjs.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Ant Design](https://ant.design/)
- [Tailwind](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- Unit Testing
  - [Jest](https://jestjs.io/)
  - [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

1. Git
2. Node: any 18.x version starting with v18.0.0 or greater
3. Yarn v1: See [Yarn website for installation instructions](https://classic.yarnpkg.com/en/docs/install/#mac-stable) (you can use npm as well)
4. A fork of the repo (for any contributions)
5. A clone of the [canonizer-3.0-frontend](https://github.com/the-canonizer/canonizer-3.0-frontend) repo on your local machine

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/the-canonizer/canonizer-3.0-frontend.git
   ```
2. Go into the project root
   ```sh
   cd canonizer-3.0-frontend
   ```
3. Copy environment variables from `.env.example` to `.env` file and update the values as required.
   ```sh
   cp .env.example .env
   ```
4. Install dependency packages
   ```sh
   yarn
   ```
5. Start the hot-reloading development server
   ```sh
   yarn dev
   ```
6. Open the site in your favorite browser
   ```sh
   open http://localhost:4000
   ```

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement". Don't forget to give the project a star! Thanks again!

### Create a branch

1. `git checkout development` from any folder in your local `canonizer-3.0-frontend` repository
2. `git pull origin development` to ensure you have the latest main code
3. `git checkout -b the-name-of-my-branch` (replacing `the-name-of-my-branch` with a suitable name) to create a branch

<!--
1. Clone the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Pretty the code for standard indentation (`npm run format`)
4. Make sure no one test case is being failed (`npm run test`)
5. Make sure Build is created successfully (`npm run build`)
6. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
7. Push to the Branch (`git push origin feature/AmazingFeature`)
8. Open a Pull Request
 -->

### Make the change

1. Save the files and check in the browser
2. Changes to React components in `src` will hot-reload

### Test the change

1. If possible, test any visual changes in all latest versions of common browsers, on both desktop and mobile.
2. Run `yarn test` from the project root to ensure that no test case is failing.
3. Run `yarn format` from the project root. (This will run Prettier)
4. Run `yarn build` from the project root to ensure that the build is created successfully.

### Push the change

1. `git add -A && git commit -m "My message"` (replacing `My message` with a commit message, such as `Fix header logo on mobile screen`) to stage and commit your changes
2. `git push my-fork-name the-name-of-my-branch`
3. Go to the [canonizer-3.0-frontend repo](https://github.com/the-canonizer/canonizer-3.0-frontend) and you should see recently pushed branches.
4. Follow GitHub's instructions to create the Pull Request.
5. If possible, include screenshots of visual changes.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- LICENSE -->

## License

Lesser MIT License

Copyright (c) 2006-2025 Canonizer.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software with minimal restriction, including without limitation the rights to use, copy, modify, merge, publish, and distribute copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

Any activity arising from use under this license must maintain compliance with all related and dependent licensees.

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Brent Allsop - [@Brent's_twitter](https://twitter.com/your_username) - brent.allsop@gmail.com

Project Link: [https://ux-dev.canonizer.com](https://ux-dev.canonizer.com)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[product-screenshot]: https://canonizer.com/images/home-screenshot.png
