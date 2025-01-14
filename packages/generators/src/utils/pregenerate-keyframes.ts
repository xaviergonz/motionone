import { AnimationGenerator } from "@motionone/types"

export interface KeyframesMetadata {
  keyframes: number[]
  duration: number
  overshootDuration: number
}

const timeStep = 10
const maxDuration = 10000
export function pregenerateKeyframes(
  generator: AnimationGenerator
): KeyframesMetadata {
  let overshootDuration: number | undefined = undefined
  let timestamp = timeStep
  let state = generator(0)
  const keyframes: number[] = [state.current]

  while (!state.done && timestamp < maxDuration) {
    state = generator(timestamp)
    keyframes.push(state.done ? state.target : state.current)

    if (overshootDuration === undefined && state.hasReachedTarget) {
      overshootDuration = timestamp
    }

    timestamp += timeStep
  }

  const duration = timestamp - timeStep

  /**
   * If generating an animation that didn't actually move,
   * generate a second keyframe so we have an origin and target.
   */
  if (keyframes.length === 1) keyframes.push(state.current)

  return {
    keyframes,
    duration: duration / 1000,
    overshootDuration: (overshootDuration ?? duration) / 1000,
  }
}
