import { makeScene2D, Code, Rect, Txt, Polygon, Line, lines } from '@motion-canvas/2d';
import { createRef, createSignal, beginSlide, DEFAULT, all, waitFor, slideTransition, Direction, } from '@motion-canvas/core';


interface BaseProps{
  x: number;
  y: number;
  w?: number;
  h?: number;
  fill?: string;
}

interface ScoreInfo{
  main_bar: BaseProps;
  back_bar: BaseProps;
  label: BaseProps;
}

export default makeScene2D(function* (view) {

  const code = createRef<Code>();

  const back_bar = createRef<Rect>(); 
  const main_bar = createRef<Rect>(); 

  const score_x = 1150;
  const score_y = 950;
  const score_w = 50;
  const score_h = 1950;
  const fail_on_tool_sig = createSignal('False');
  const warn_th_sig = createSignal(0.7);
  const warn_lab_sig = createSignal(() => score_h/2 - warn_th_sig() * score_h);
  const fail_th_sig = createSignal(0.5);
  const fail_lab_sig = createSignal(() => score_h/2 - fail_th_sig() * score_h);
  const score_sig = createSignal(0.75);
  const score_h_sig = createSignal(() => score_sig() * score_h);
  const score_lab_sig = createSignal(() => score_h/2 -score_h_sig());
  const colors = {
    ok: "#36c250",
    warn: "gold",
    fail: "crimson"
  };
  const evalScore: ScoreInfo = {
    back_bar: {
      x: score_x,
      y: score_y,
      w: score_w,
      h: score_h,
      fill: 'gray',
    },
    // these are relative to valyes in back_bar
    main_bar: {
      x: 0,
      y: score_h/2,
      w: score_w,
      fill: 'limegreen',
    },
    label: {
      x: 0,
      y: score_h/2 + 50,
      w: score_w,
      h: score_h,
      fill: 'white',
    },
  };

  view.add(
    <>
      <Code
        x={-600}
        ref={code}
        fontSize={85}
        fontFamily={'JetBrains Mono, monospace'}
        code={() => `\
  rubric = EvalRubric(
      warn_threshold=${warn_th_sig().toFixed(2)},
      fail_threshold=${fail_th_sig().toFixed(2)},
      fail_on_tool_selection=${fail_on_tool_sig()},
      tool_selection_weight=1.0,
  )`}
      />,
      <Rect
        ref={back_bar}
        bottom={[
          evalScore.back_bar.x,
          evalScore.back_bar.y
        ]}
        width={evalScore.back_bar.w}
        height={evalScore.back_bar.h}
        fill={evalScore.back_bar.fill}
      >
        <Rect
          ref={main_bar}
          bottom={() => [
            evalScore.main_bar.x,
            evalScore.main_bar.y]
          }
          width={evalScore.main_bar.w}
          height={() => score_h_sig()}
          fill={() => {
            if(score_sig() < fail_th_sig()) {
              return colors.fail;
            }
            if(score_sig() < warn_th_sig()) {
              return colors.warn;
            }
            return colors.ok
          }}
        />
        <Txt
          text={"score"} 
          fontSize={64}
          fontFamily={"sans-serif"}
          fill={evalScore.label.fill}
          bottom={[evalScore.label.x, evalScore.label.y]}
        />      
        <Txt
          fontSize={35}
          fill={'white'}
          text={() => score_sig().toFixed(2)} 
          bottom={() => [-130, 20 + score_lab_sig()]}
        />
        <Line
          points={[
            [0, 0],
            [40, 0],
          ]}
          lineWidth={3}
          bottom={() => [-80, score_lab_sig()]} 
          stroke={'white'}
          lineDash={[7, 3]}
        /> 
        <Polygon
          sides={3}
          size={20}
          rotation={90}
          bottom={() => [-50, score_lab_sig()]} 
          fill={'white'}>
        </Polygon>
        <Txt
          fontSize={35}
          fill={colors.warn}
          text={() => warn_th_sig().toFixed(2)} 
          bottom={() => [105, 20 + warn_lab_sig()]}
        />
        <Line
          // warn line
          points={[
            [0, 0],
            [120, 0],
          ]}
          lineWidth={3}
          bottom={() => [-60, warn_lab_sig()]} 
          stroke={colors.warn}
          lineDash={[7, 3]}
        /> 
        <Txt
          fontSize={35}
          fill={colors.fail}
          text={() => fail_th_sig().toFixed(2)} 
          bottom={() => [105, 20 + fail_lab_sig()]}
        />
        <Line
          // fail line
          points={[
            [0, 0],
            [120, 0],
          ]}
          lineWidth={3}
          bottom={() => [-60, fail_lab_sig()]} 
          stroke={colors.fail}
          lineDash={[7, 3]}
        /> 
      </Rect>
    </>
  );

  yield* beginSlide('warn slide')
  yield* all(
    code().selection(code().findFirstRange(/warn_threshold=(\d*\.\d+|\d+(\.\d*)?)/g), 0.6),
    warn_th_sig(.95, 5)
  );

  yield* beginSlide('fail slide')
  yield* all(
    code().selection(code().findFirstRange(/fail_threshold=(\d*\.\d+|\d+(\.\d*)?)/g), 0.6),
    fail_th_sig(.85, 5)
  );

  yield* beginSlide('improvement slide')
  yield* all(
    code().selection(DEFAULT, 0.6),
    score_sig(0.98, 5)
  );

  yield* beginSlide('other arguments slide')
  yield* code().selection(lines(3, 4), 0.6),
  yield* waitFor(1);

  yield* beginSlide('other arguments slide 2')
  yield* all(
    fail_on_tool_sig("True", 0.5),
    main_bar().fill(colors.fail, 0.5)
  );
  yield* waitFor(1);

  yield* beginSlide('end slide')
  yield* all(
    code().selection(DEFAULT, 0.6),
    score_sig(1, 2),
  )
  yield* all(
    main_bar().fill(colors.ok, 0.5),
  );
  yield* waitFor(1);
  yield* slideTransition(Direction.Left);
});
