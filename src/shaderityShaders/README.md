# Specification of glsl in shaderity graph shader pack

The shaderity graph shader pack is a collection of node definition data and node GUI data. The node definition data is required to create a shader in the [shaderity-graph](https://github.com/actnwit/shaderity-graph).

The data for a single node is written in a single glsl file. The glsl code will be converted into an object of ShaderNodeData type  (see /src/type/Type and /src/type/README.md) that is the node definition and GUI data by the webpack loader in `/loader/ShaderpackLoader.ts`. To extract the node data by the ShaderpackLoader, the glsl file has to be satisfied the following specifications [glsl code](#glsl-code) and [SGSP comment](#sgsp-comment) for this library. SGSP comment is a special comment to be parsed by ShaderpackLoader, which contains, e.g., information about the node's GUI.

Regarding the extension and location of the glsl file, the glsl file for the vertex shader node should have the extension `.vs.glsl` and be placed in `/src/shaderityShaders/vertex`.
The glsl file for the fragment shader should have the extension `.fs.glsl` and be placed in `/src/shaderityShaders/fragment`. The glsl file for the vertex and fragment shader (common use cases) should have the extension `.glsl`(not `.vs.glsl` or `.fs.glsl`) and be placed in `/src/shaderityShaders/common`.

## glsl code

Each glsl file mainly contains functions that correspond to nodes. The syntax is almost the same as normal glsl language, but there are some limitations to parse the function with webpack loader.

### function

In each glsl file, we need to write functions. There are two types of functions that can be written in the following:

1. entry shader function: A function that is called by the main function.
2. sub shader function: A function that is called by only the entry shader function of this glsl file(do not called by outside)

The name of the entry shader function should be the same as the name of the glsl file to avoid duplication of names with functions in other glsl files. Also, the name of the sub shader function should start with `(name of entry shader function)_`.

#### entry shader function

- The return value of the function must be void.
- The `void` in the return value, the function name, and the `(` at the beginning of the argument must be written in one line.
- All arguments must have an in out declaration.
- If you want to use attribute, varying, or uniform variables in a function, you need to specify them as input or output in the argument. If you start the argument name with `a_`, `v_`, or `u_`, If you start the argument name with a_, v_, or u_, the corresponding SocketData in ShaderNodeData.SocketDataArray will be the SocketData of attribute, varying, and uniform, respectively.
- When the output SocketDataArray is used in shaderity-graph, the variable name in the global space of the attribute variable will be the same as the variable name written in the argument. Even different nodes and different glsl files will share the same attribute variable if the same name is used in the function argument.
- The uniform variable refers to a different uniform variable for each node. If you want to share the uniform variable, you need to use the [`SharingUniformVariable` option](#sharinguniformvariable) in `SGSP comment`.
- It is recommended that arguments beginning with `v_`, i.e., sockets for varying variables, should not be used except on nodes that perform flat shading. After creating the shader graph, change the standard socket to a varying socket if necessary.
- When the output SocketDataArray is used in shaderity-graph, the variable name in the global space of the varying variable will be automatically decided by the shaderity-graph.

#### sub shader function

- The return value of the function must not be void.
- If you want to use attribute, varying, or uniform variables, you need to get them from entry shader function.

### global data

The global data refers to all the code you write outside the function definition. Only the extension directive needs to be written correctly.

- Must contain
  - required extension directives (`#extension ...`)

- Must not contain
  - define directive (`#define ...`)
  - global variable (constant variable, attribute variable, etc...)

- As necessary
  - global precision (`precision ...`)
    - Note: You can write the global precision in the shader, but the setting is ignored.
            The global precision can only be used to avoid linter errors.

## SGSP comment

In this library, the data required by the GUI and additional data of the storage qualifiers
are specified by comments in the glsl file.
These data are specified in the format `// <SGSP> (param name) : (param value)`.


The following is the parameter name list

- [NodeName](#nodename)
- [AvailableShaderStage](#availableshaderstage)
- [GUIMode](#guimode)
- [VaryingInterpolation](#varyinginterpolation)
- [ShaderOutputSocket](#shaderoutputsocket)
- [SharingUniformVariable](#sharinguniformvariable)
- [SocketName](#socketname)
- [PullDown_Description](#pulldown_description)
- [PullDown_DisplayName](#pulldown_displayname)
- [SetVector_Descriptions](#setvector_descriptions)
- [SetVector_DefaultValues](#setvector_defaultvalues)
- [SetMatrix_DefaultValues](#setmatrix_defaultvalues)

### NodeName

The name of the node (corresponding to the glsl file). The default value is ''.

``` glsl
// <SGSP> NodeName: (node name)

// e.g.
// <SGSP> NodeName: World matrix
```

### AvailableShaderStage

Shader stage that can be used by node.

``` glsl
// <SGSP> AvailableShaderStage: (shader stage name)

// e.g.
// <SGSP> AvailableShaderStage: Vertex
```

- Allowed Values: `VertexAndFragment`(default), `Vertex`, `Fragment`

### GUIMode

Appearance of node.

- Standard

- PullDown

  The node has pull down list.
  This node can choose the entry function to use.

- SetVector

  The node has number input field of vector.
  This node can specify the input value of a vector type uniform input socket.

- SetMatrix

  The node has number input field of matrix.
  This node can specify the input value of a matrix type uniform input socket. For this node, the input socket must be only one uniform input socket.

- Texture

  The node has texture input field.
  This node can specify the input value of a texture type uniform input socket.


``` glsl
// <SGSP> GUIMode: (gui mode name)

// e.g.
// <SGSP> GUIMode: Value
```

- Allowed Values: `Standard`(default), `Pulldown`, `SetVector`, `SetMatrix`, `SetTexture`

// TODO: add sample images of each gui mode

### VaryingInterpolation

Interpolation type of specified varying variable.

``` glsl
// <SGSP> VaryingInterpolation: (target varying variable name in shader function argument) (interpolation mode name)

// e.g.
// <SGSP> VaryingInterpolation: v_varyingVec3 flat
```

- Allowed Values: `smooth`(default), `flat`

### ShaderOutputSocket

Specify a socket to output values to gl_Position (vertex shader) and gl_FragColor (fragment shader). This parameter is used for output sockets of type Vec4.

If you specify the socket that starts the argument name with `v_`, the socket changes from varying output socket to shader output socket.

``` glsl
// <SGSP> ShaderOutputSocket: (target variable name in shader function argument)

// e.g.
// <SGSP> ShaderOutputSocket: outVec4
```

### SharingUniformVariable

Sharing a uniform variable with multiple nodes. If you want to share the uniform variable(e.g. world matrix) with some nodes, you need to specify this parameter.

``` glsl
// <SGSP> SharingUniformVariable: (target uniform variable names in shader function argument)

// e.g.
// <SGSP> SharingUniformVariable: u_worldMatrix u_viewMatrix u_projectionMatrix
```

### SocketName

The display name of socket.

``` glsl
// <SGSP> SocketName: (target variable name in shader function argument) (display socket name)

// e.g.
// <SGSP> SocketName: outVec4 vector4
```

### PullDown_Description

This parameter is only used when the GUIMode is in PullDown mode.

Specify the description of pull down menu.

``` glsl
// <SGSP> PullDown_Description: (description)

// e.g.
// <SGSP> PullDown_Description: position type
```

// TODO: add sample images of description of pull down menu.

### PullDown_DisplayName

This parameter is only used when the GUIMode is in PullDown mode.

Specify the display name of pull down list.

``` glsl
// <SGSP> PullDown_DisplayName: (display PullDown name)

// e.g.
// <SGSP> PullDown_DisplayName: world position
```

### SetVector_Descriptions

This parameter is only used when the GUIMode is in SetVector mode.

Specify the description of each element of a vector or scalar.
If you want to specify the description of multiple elements, such as vector 2, separate the elements with spaces.

``` glsl
// <SGSP> SetVector_Descriptions: (target uniform variable name in shader function argument) (descriptions)

// e.g.
// <SGSP> SetVector_Descriptions: u_outVec3 r g b
```

When the GUIMode is in SetVector mode and this parameter is not specified, the following default values are used.

- Default Values:
  - `x` (Scalar)
  - `x y` (Vec2)
  - `x y z` (Vec3)
  - `x y z w` (Vec4)

### SetVector_DefaultValues

This parameter is only used when the GUIMode is in SetVector mode.

Specify the default values of each element of a vector or scalar.
If you want to specify the description of multiple elements, such as vector 2, separate the elements with spaces.

``` glsl
// <SGSP> SetVector_DefaultValues: (target uniform variable name in shader function argument) (default values)

// e.g.
// <SGSP> SetVector_DefaultValues: u_outVec3 1.0 1.0 1.0
```

- Implementation Note: When the GUIMode is in SetVector mode and this parameter is not specified, the following default values are used:

- Default Values:
  - `0` (Scalar)
  - `0 0` (Vec2)
  - `0 0 0` (Vec3)
  - `0 0 0 0` (Vec4)

### SetMatrix_DefaultValues

This parameter is only used when the GUIMode is in SetMatrix mode.

Specify the default values of each element of a matrix.
Separate each number with a space or tab. Matrices have row priority.


``` glsl
// <SGSP> SetMatrix_DefaultValues: (default values)

// e.g.
// <SGSP> SetMatrix_DefaultValues:  1 0 0 0   1 2 0 0   0 0 1 0   0 0 0 1

//  1 0 0 0
//  1 2 0 0
//  0 0 1 0
//  0 0 0 1
```

- Implementation Note: When the GUIMode is in SetMatrix mode and this parameter is not specified, the default values are the identity matrices like followings:

- Default Values:
  - `1 0   0 1` (Mat22)
  - `1 0 0   0 1 0   0 0 1` (Mat33)
  - `1 0 0 0   0 1 0 0  0 0 1 0   0 0 0 1` (Mat44)
