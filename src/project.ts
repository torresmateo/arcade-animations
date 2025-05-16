import {makeProject} from '@motion-canvas/core';

import example from './scenes/example?scene';

import {Code, LezerHighlighter} from '@motion-canvas/2d'
import { parser } from '@lezer/python';

Code.defaultHighlighter = new LezerHighlighter(parser);

export default makeProject({
  scenes: [example],
});
