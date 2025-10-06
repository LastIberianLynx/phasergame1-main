import Phaser from 'phaser';

export class ColorReplacePipeline extends Phaser.Renderer.WebGL.Pipelines.SinglePipeline {
  private color: Phaser.Math.Vector3;

  constructor(game: Phaser.Game) {
    super({
      game,
      fragShader: `
        precision mediump float;

        // The main texture of the sprite
        uniform sampler2D uMainSampler;

        // Texture coordinates for this fragment
        varying vec2 outTexCoord;

        // RGB color we want to apply
        uniform vec3 uColor;

        void main(void) {
            // Sample the original texture
            vec4 texColor = texture2D(uMainSampler, outTexCoord);

            // Ignore fully transparent pixels
            if (texColor.a < 0.01) {
                discard;
            }

            // Replace RGB with uColor, preserve original alpha
            gl_FragColor = vec4(uColor * texColor.a, texColor.a);
        }
      `,
    });

    // Default outline color = green
    this.color = new Phaser.Math.Vector3(0, 1, 0);
  }

  /**
   * Change the outline color dynamically
   */
  setColor(r: number, g: number, b: number): void {
    this.color.set(r, g, b);
  }

  /**
   * Called automatically before drawing to bind uniforms
   */
  onBind(): void {
    this.set3f('uColor', this.color.x, this.color.y, this.color.z);
  }
}
