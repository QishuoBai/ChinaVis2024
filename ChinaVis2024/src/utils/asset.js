const knowledgeOrder = {
  group: [
    ["b3C9s_j0v1yls8", "b3C9s_l4z6od7y"],
    ["g7R2j_e0v1yls8", "g7R2j_j1g8gd3v"],
    ["k4W1c_h5r6nux7"],
    ["m3D1v_r1d7fr3l", "m3D1v_t0v5ts9h", "m3D1v_v3d9is1x"],
    ["r8S3g_l0p5viby", "r8S3g_n0m9rsw4"],
    ["s8Y2f_v4x8by9j"],
    ["t5V9e_e1k6cixp"],
    ["y9W5d_c0w4mj5h", "y9W5d_e2j7p95s", "y9W5d_p8g6dgtv"],
  ],
  array: [
    "b3C9s_j0v1yls8",
    "b3C9s_l4z6od7y",
    "g7R2j_e0v1yls8",
    "g7R2j_j1g8gd3v",
    "k4W1c_h5r6nux7",
    "m3D1v_r1d7fr3l",
    "m3D1v_t0v5ts9h",
    "m3D1v_v3d9is1x",
    "r8S3g_l0p5viby",
    "r8S3g_n0m9rsw4",
    "s8Y2f_v4x8by9j",
    "t5V9e_e1k6cixp",
    "y9W5d_c0w4mj5h",
    "y9W5d_e2j7p95s",
    "y9W5d_p8g6dgtv",
  ],
  Radian: [
    { sa: 0.0, ea: 0.39269908169872414 },
    { sa: 0.39269908169872414, ea: 0.7853981633974483 },
    { sa: 0.7853981633974483, ea: 1.1780972450961724 },
    { sa: 1.1780972450961724, ea: 1.5707963267948966 },
    { sa: 1.5707963267948966, ea: 2.356194490192345 },
    { sa: 2.356194490192345, ea: 2.6179938779914944 },
    { sa: 2.6179938779914944, ea: 2.8797932657906435 },
    { sa: 2.8797932657906435, ea: 3.141592653589793 },
    { sa: 3.141592653589793, ea: 3.5342917352885173 },
    { sa: 3.5342917352885173, ea: 3.9269908169872414 },
    { sa: 3.9269908169872414, ea: 4.71238898038469 },
    { sa: 4.71238898038469, ea: 5.497787143782138 },
    { sa: 5.497787143782138, ea: 5.759586531581287 },
    { sa: 5.759586531581287, ea: 6.021385919380437 },
    { sa: 6.021385919380437, ea: 6.283185307179586 },
  ],
};
const colorOfRose = (num) => {
  switch (num) {
    case 0:
    case 1:
      return "#448aff";
    case 2:
    case 3:
      return "#1565c0";
    case 4:
      return "#009688";
    case 5:
    case 6:
    case 7:
      return "#8bc34a";
    case 8:
    case 9:
      return "#ffc107";
    case 10:
      return "#ff9800";
    case 11:
      return "#f44336";
    case 12:
    case 13:
    case 14:
      return "#ad1457";
    default:
      return "red";
  }
};
const colorOfTitle = (num) => {
  switch (num) {
    case 0:
      return "red";
    case 1:
      return "blue";
    case 2:
      return "yellow";
    default:
      return "black";
  }
};
const colorOfStack = ["#48cae4", "#00b4d8", "#0096c7", "#0077b6"];
const subknowledgeCount = [
  { name: "b3C9s_j0v1yls8", num: 1},
  { name: "b3C9s_l4z6od7y", num: 2},
  { name: "g7R2j_e0v1yls8", num: 4},
  { name: "g7R2j_j1g8gd3v", num: 1},
  { name: "k4W1c_h5r6nux7", num: 1},
  { name: "m3D1v_r1d7fr3l", num: 9},
  { name: "m3D1v_t0v5ts9h", num: 1},
  { name: "m3D1v_v3d9is1x", num: 2},
  { name: "r8S3g_l0p5viby", num: 2},
  { name: "r8S3g_n0m9rsw4", num: 4},
  { name: "s8Y2f_v4x8by9j", num: 1},
  { name: "t5V9e_e1k6cixp", num: 5},
  { name: "y9W5d_c0w4mj5h", num: 8},
  { name: "y9W5d_e2j7p95s", num: 1},
  { name: "y9W5d_p8g6dgtv", num: 2},
];
const knowledgeCount = [
  { name: "b3C9s", num: 3 },
  { name: "g7R2j", num: 5 },
  { name: "k4W1c", num: 1 },
  { name: "m3D1v", num: 12 },
  { name: "r8S3g", num: 6 },
  { name: "s8Y2f", num: 1 },
  { name: "t5V9e", num: 5 },
  { name: "y9W5d", num: 11 },
];

export {
  knowledgeOrder,
  colorOfRose,
  colorOfTitle,
  colorOfStack,
  subknowledgeCount,
  knowledgeCount,
};
