import {AvailableShaderStage, GUIMode} from '../../../../type/Enum';
import {SamplerInputNodeData} from '../../../../type/Type';

export default {
  nodeType: 'samplerInputNode',
  socketDataArray: [
    {
      socketName: 'u_sampler2D',
      direction: 'in',
      uniformData: {
        type: 'sampler2D',
      },
    },
    {
      socketName: 'texture2D',
      direction: 'out',
      samplerType: 'sampler2D',
    },
  ],

  nodeName: 'Texture 2D',
  category: ['Input', 'Texture'],
  availableShaderStage: AvailableShaderStage.VertexAndFragment,
  guiMode: GUIMode.SetTexture,
} as SamplerInputNodeData;
