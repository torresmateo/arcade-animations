import { makeScene2D, Code, Rect, word } from '@motion-canvas/2d';
import { createRef, createSignal, beginSlide, DEFAULT, all, waitFor, } from '@motion-canvas/core';


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

  const binary = createRef<Code>();
  const numeric = createRef<Code>();
  const similarity = createRef<Code>();
  const datetime = createRef<Code>();

  const x = -1800;

  view.add(
    <>
      <Code
        ref={binary}
        fontSize={85}
        left={[x, -600]}
        opacity={0}
        offsetX={-1}
        x={x}
        fontFamily={'JetBrains Mono, monospace'}
        code={() => `BinaryCritic()`}
      />
        ,
      <Code
        left={[x, -200]}
        ref={numeric}
        offsetX={-1}
        fontSize={85}
        opacity={0}
        fontFamily={'JetBrains Mono, monospace'}
        code={() => `NumericCritic()`}
      />
      ,
        <Code
          left={[x, 200]}
          offsetX={-1}
          ref={similarity}
          fontSize={85}
          opacity={0}
          fontFamily={'JetBrains Mono, monospace'}
          code={() => `SimilarityCritic()`}
        />
      ,
      <Code
        ref={datetime}
        left={[x, 600]}
        offsetX={-1}
        fontSize={85}
        opacity={0}
        fontFamily={'JetBrains Mono, monospace'}
        code={() => `DatetimeCritic()`}
        />
    </>
  );

  yield* beginSlide('critics entrance')
  yield* waitFor(1);
  yield* binary().opacity(1, 0.5);
  yield* numeric().opacity(1, 0.5);
  yield* similarity().opacity(1, 0.5);
  yield* datetime().opacity(1, 0.5);

  yield* beginSlide('binary')
  yield* all(
    binary().opacity(1, 2),
    numeric().opacity(0.2, 2),
    similarity().opacity(0.2, 2),
    datetime().opacity(0.2, 2),
  );
  yield* waitFor(1);

  yield* beginSlide('numeric')
  yield* all(
    binary().opacity(0.2, 2),
    numeric().opacity(1, 2),
    similarity().opacity(0.2, 2),
    datetime().opacity(0.2, 2),
  );
  yield* waitFor(1);

  yield* beginSlide('similarity')
  yield* all(
    binary().opacity(0.2, 2),
    numeric().opacity(0.2, 2),
    similarity().opacity(1, 2),
    datetime().opacity(0.2, 2),
  );
  yield* waitFor(1);

  yield* beginSlide('datetime')
  yield* all(
    binary().opacity(0.2, 2),
    numeric().opacity(0.2, 2),
    similarity().opacity(0.2, 2),
    datetime().opacity(1, 2),
  );
  yield* waitFor(1);

  yield* beginSlide('common parameters')
  yield* all(
    binary().opacity(1, 0.5),
    numeric().opacity(1, 0.5),
    similarity().opacity(1, 0.5),
    datetime().opacity(1, 0.5),
  );
  yield* all(
    binary().code.insert([0, 13], 'critic_field="user_name"', 2),
    numeric().code.insert([0, 14], 'critic_field="age"', 2),
    similarity().code.insert([0, 17], 'critic_field="bio"', 2),
    datetime().code.insert([0, 15], 'critic_field="birthday"', 2),
  );
  yield* waitFor(1);

  yield* beginSlide('specific parameters')
  yield* all(
    numeric().code.insert([0, 14 + 18], ', value_range=[18, 120]', 2),
    similarity().code.insert([0, 17 + 18], ', similarity_threshold=0.9', 2),
    datetime().code.insert([0, 15 + 23], ', tolerance=timedelta(days=1)', 2),
  );
  yield* waitFor(1);
});
