# Specification of NodeData type

The main purpose of this library is to create the definition data for each node of a node-based shader that uses shaderity-graph. The node data (the child interfaces of 'AbstractNodeData') are the definition data.

The followings are the child interfaces of 'AbstractNodeData'.

- [ShaderityNodeData](#shaderitynodedata)
- [SamplerInputNodeData](#samplerinputnodedata)

## ShaderityNodeData

When you import the glsl file in the typescript file of this library, we get a ShaderityNodeData type object. The specification of the ShaderityNodeData is following:

|Name|Type|Description|Required|
|:--|:--|:--|:--|
|shaderFunctionName|`string`|Name of entry shader function in the shaderFunctionCode|Yes ✅|
|shaderFunctionCode|`string`|Shader code of this node|Yes ✅|
|extensions|`string[0-*]`|Required extensions in the shaderFunctionCode|No|
|socketDataArray|`Object[0-*]`|Array of socket data in this node|Yes ✅|
|nodeName|`string`|Name to display in the GUI|Yes ✅|
|category|`string[0-*]`|Category according to the role of the node|Yes ✅|
|availableShaderStage|`string`|Specify the shader stage that this node can use|Yes ✅|
|guiMode|`string`|Specify recommend gui mode|Yes ✅|
|guiOptions|`Object`|Data required when using recommend gui mode|No|
|nodeType|`string`|Specify the node data type|No|

### ShaderityNodeData.shaderFunctionName ✅

Name of entry shader function in the shaderFunctionCode.
We use this name when calling the function corresponding to this node.

- Type: `string`

- Required: Yes

### ShaderityNodeData.shaderFunctionCode ✅

Shader functions corresponding to this node.
There are two types of functions in the shaderFunctionCode.

1. entry shader function: A function that can be called outside (e.g. main function).
2. sub shader function: A function that is not called from outside, but is called only from the entry shader function.

- Type: `string`

- Required: Yes

### ShaderityNodeData.extensions

Required extensions in the [shaderFunctionCode](#shaderfunctioncode).
The lack of this property means that there are no necessary extensions.

- Type: `string[0-*]`

- Required: No

### ShaderityNodeData.socketDataArray ✅

Data in the socket for use with shaderity-graph.
Each socket data corresponds to an argument of the shader function corresponding to this node.
For more information, see the interface that extends AbstractSocketData in the Shaderity-Graph-JSON specification of [shaderity-graph](https://github.com/actnwit/shaderity-graph).

- Type: `Object[0-*]`

- Required: Yes

### ShaderityNodeData.nodeName ✅

Name to display in the GUI.

- Type: `string`

- Required: Yes

### ShaderityNodeData.category ✅

Category according to the role of the node. The category hierarchy can be used to select nodes such as in a menu screen for adding nodes.

- Type: `string[0-*]`

- Required: Yes

### ShaderityNodeData.availableShaderStage ✅

Specify the shader stage that this node can use. If an invalid value is specified in the glsl file, the guiMode will be set to `vertexandfragment`.

- Type: `string`

- Required: Yes

- Allowed values
  - `vertex`: The shaderFunctionCode can be used in only vertex shader.
  - `fragment`: The shaderFunctionCode can be used in only fragment shader.
  - `vertexandfragment`: The shaderFunctionCode can be used in vertex and fragment shader.
  - `unknown`: Not used(A value that is only used by the loader)

### ShaderityNodeData.guiMode ✅

Specify recommend gui mode. If an invalid value is specified in the glsl file, the guiMode will be set to `standard`.

- Type: `string`

- Required: Yes

- Allowed values
  - `standard`: The node has only sockets (default).
  - `pulldown`: The node has sockets and pull down menu to choose entry shader function of the shader function.
  - `setvector`: The node has sockets and numerical input fields of a vector.
  - `setmatrix`: The node has sockets and numerical input fields of a matrix.
  - `settexture`: The node has sockets and an image input field.
  - `unknown`: Not used(A value that is only used by the loader)

### ShaderityNodeData.nodeType

Specify the node data type. The value corresponding to this node data is `shaderityNode`.
If this parameter is not specified, the value of `node data` is `shaderityNode`.

- Type: `string`

- Required: Yes

- Allowed values
  - `shaderityNode`

### ShaderityNodeData.guiOptions

If options are required for the specified guiMode, they will be written in this object.

|Name|Type|Description|Required|
|:--|:--|:--|:--|
|pullDown|`Object`|Options for guiMode: PullDown|No|
|setVector|`Object`|Options for guiMode: SetVector|No|
|setMatrix|`Object`|Options for guiMode: SetMatrix|No|

- Type: `Object`

- Required: No

### guiOptions.pullDown

Options for guiMode: PullDown.
If the guiMode is `pullDown`, this property is required.

|Name|Type|Description|Required|
|:--|:--|:--|:--|
|description|`string`|Description of pull down menu|Yes ✅|
|items|`Object`|Options of pull down items|Yes ✅|

- Type: `Object`

- Required: No

### guiOptions.pullDown.description

Description of pull down menu.
It is supposed to be displayed near the pull-down menu in the GUI as a description of what the menu is.

- Type: `Object`

- Required: Yes

### guiOptions.pullDown.items

Items of pull down menu.

`guiOptions.pullDown.items[shaderFunc]`

|Name|Type|Description|Required|
|:--|:--|:--|:--|
|functionName|`string`|Entry shader function name corresponding to the item|Yes ✅|
|displayName|`string`|The name displayed in the GUI as an item |No|

- Type: `Object[0-*]`

- Required: Yes

### guiOptions.pullDown.item.functionName ✅

Entry shader function name corresponding to the item

If the value of the pull-down menu changes, use the guiOptions.pullDown.item.functionName corresponding to the value of the menu as the shaderFunctionName.

- Type: `string`

- Required: Yes

### guiOptions.pullDown.item.displayName

The name displayed in the GUI as an item in a pull-down menu.
If this property is missing, display guiOptions.pullDown.item.functionName instead.

- Type: `string`

- Required: No

### guiOptions.setVector

Options for guiMode: setVector.
When the guiMode is `setVector`, this property is used.

|Name|Type|Description|Required|
|:--|:--|:--|:--|
|(uniform variable name)|`Object`|VectorOption object|No|

The key of the guiOptions.setVector object is the argument variable name of the shader function which is corresponding to vector(or scalar) type uniform input socket.

If there is no value to be specified for a VectorOption, there is no need to create a VectorOption object for that uniform variable name.

- Type: `Object`

- Required: No

### VectorOption

|Name|Type|Description|Required|
|:--|:--|:--|:--|
|descriptions|`string`|Description of each element|No|
|defaultValues|`number[]`|Default value of each element|No|
|step|`number`|Interval between legal numbers in an input element|No|

- Type: `Object`

### VectorOption.descriptions

The description of each element.

If this value is not set, the library that uses this library should use ['x', 'y', 'z', 'w'] as the default value.

- Type: `string[1-4]`

- Required: No

### VectorOption.defaultValues

The default value of each element.

If this value is not set, the library that uses this library should use [0, 0, 0, 0] as the default value.

- Type: `number[1-4]`

- Required: No

### VectorOption.step

The interval between legal numbers in an input element.

If this value is not set, the library that uses this library should use 0.01 as the default value.

- Type: `number`

- Required: No

### guiOptions.setMatrix

Options for guiMode: setMatrix.
When the guiMode is `setMatrix`, this property is used.

|Name|Type|Description|Required|
|:--|:--|:--|:--|
|defaultValues|`number[4,9,16]`|defaultValues of matrix|Yes ✅|

- Type: `Object`

- Required: No

### guiOptions.setMatrix.defaultValues ✅

The defaultValues of matrix. If the guiMode is the setMatrix and this property does not exist, the default value is the identity matrix.

- Type: `number[4,9,16]`

- Required: Yes

<br>

## SamplerInputNodeData

This is the NodeData for the Shaderity graph library to define the SamplerInputNode.

|Name|Type|Description|Required|
|:--|:--|:--|:--|
|socketDataArray|`Object[2]`|Array of socket data in this node|Yes ✅|
|nodeName|`string`|Name to display in the GUI|Yes ✅|
|category|`string[0-*]`|Category according to the role of the node|Yes ✅|
|availableShaderStage|`string`|Specify the shader stage that this node can use|Yes ✅|
|guiMode|`string`|Specify recommend gui mode|Yes ✅|
|nodeType|`string`|Specify the node data type|Yes ✅|

### SamplerInputNodeData.socketDataArray ✅

Data in the socket for use with shaderity-graph.
Each socket data corresponds to an argument of the shader function corresponding to this node.
For more information, see the interface that extends AbstractSocketData in the Shaderity-Graph-JSON specification of [shaderity-graph](https://github.com/actnwit/shaderity-graph).

- Type: `Object[0-*]`

- Required: Yes

### SamplerInputNodeData.nodeName ✅

Name to display in the GUI.

- Type: `string`

- Required: Yes

### SamplerInputNodeData.availableShaderStage ✅

Specify the shader stage that this node can use. If an invalid value is specified in the glsl file, the guiMode will be set to `vertexandfragment`.

- Type: `string`

- Required: Yes

- Allowed values
  - `vertex`: The shaderFunctionCode can be used in only vertex shader.
  - `fragment`: The shaderFunctionCode can be used in only fragment shader.
  - `vertexandfragment`: The shaderFunctionCode can be used in vertex and fragment shader.
  - `unknown`: Not used(A value that is only used by the loader)

### SamplerInputNodeData.guiMode ✅

Specify recommend gui mode. To choose a texture, the guiMode of this node is 'settexture'.

- Type: `string`

- Required: Yes

- Allowed values
  - `settexture`: The node has sockets and an image input field.

### SamplerInputNodeData.nodeType

Specify the node data type. The value corresponding to this node data is `samplerInputNode`.

- Type: `string`

- Required: Yes

- Allowed values
  - `samplerInputNode`
