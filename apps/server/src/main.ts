/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { App,PuppeteerService } from "@linkcat/core";
import {GithubPlugin} from '@linkcat/plugin-linkcat-github'
let app = new App();
app.service("page",PuppeteerService);
app.plugin(GithubPlugin);
app.start();
