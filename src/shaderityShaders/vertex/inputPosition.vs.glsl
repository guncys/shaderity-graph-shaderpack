// <SGSP> NodeName: input position
// <SGSP> Category: Input Geometry
// <SGSP> AvailableShaderStage: Vertex
// <SGSP> GUIMode: PullDown
// <SGSP> SharingUniformVariable: u_worldMatrix u_viewMatrix u_projectionMatrix

// <SGSP> PullDown_Description: space

// <SGSP> PullDown_DisplayName: clip
void inputPosition_clip(
  in vec4 a_position,
  in mat4 u_worldMatrix,
  in mat4 u_viewMatrix,
  in mat4 u_projectionMatrix,
  out vec4 outPosition
) {
  outPosition = u_projectionMatrix * u_viewMatrix * u_worldMatrix * a_position;
}

// <SGSP> PullDown_DisplayName: view
void inputPosition_view(
  in vec4 a_position,
  in mat4 u_worldMatrix,
  in mat4 u_viewMatrix,
  in mat4 u_projectionMatrix,
  out vec4 outPosition
) {
  outPosition = u_viewMatrix * u_worldMatrix * a_position;
}

// <SGSP> PullDown_DisplayName: world
void inputPosition_world(
  in vec4 a_position,
  in mat4 u_worldMatrix,
  in mat4 u_viewMatrix,
  in mat4 u_projectionMatrix,
  out vec4 outPosition
) {
  outPosition = u_worldMatrix * a_position;
}

// <SGSP> PullDown_DisplayName: object
void inputPosition_object(
  in vec4 a_position,
  in mat4 u_worldMatrix,
  in mat4 u_viewMatrix,
  in mat4 u_projectionMatrix,
  out vec4 outPosition
) {
  outPosition = a_position;
}
