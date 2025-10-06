// outline-pipeline.ts
//deprecated
import Phaser from 'phaser';

export class OutlinePipeline extends Phaser.Renderer.WebGL.Pipelines.SinglePipeline {
  constructor(game: Phaser.Game) {
    super({
      game,
      fragShader: `
      precision mediump float;

      uniform sampler2D uMainSampler;
      varying vec2 outTexCoord;
      uniform vec4 outlineColor;
      uniform vec2 resolution;
      uniform float outlineThickness;

      void main(void) {
          vec4 color = texture2D(uMainSampler, outTexCoord);

          if (color.a > 0.0) {
              gl_FragColor = color;
              return;
          }

          float alpha = 0.0;
          vec2 texel = outlineThickness / resolution;

          for(int x = -1; x <= 1; x++) {
              for(int y = -1; y <= 1; y++) {
                  vec2 offset = vec2(float(x), float(y)) * texel;
                  vec4 sample = texture2D(uMainSampler, outTexCoord + offset);
                  alpha = max(alpha, sample.a);
              }
          }

          if(alpha > 0.0) {
              gl_FragColor = outlineColor;
          } else {
              gl_FragColor = vec4(0.0);
          }
      }
      `
    });

    // Uniforms are set **per sprite**, not in the constructor
    // You cannot call `setUniform` here for all sprites
  }
}
