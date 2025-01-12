// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2021 Dominic Heil <d.heil@campus.tu-berlin.de>

import { Typography } from "@mui/material";
import React from "react";
import { textColor } from "../assets/jss/colorPalette";

/**
 * Typography used for headings. Customized with Noto Sans font. Builds up on MUI Typography.
 * @param props any props that are passed to the MUI Typography
 * @returns {JSX.Element}
 */
export default function HeaderTypography(props){
	return <Typography {...props} style={{ fontFamily: "Montserrat", color: textColor,  ...props.style }}>
		{props.children}
	</Typography>;
}