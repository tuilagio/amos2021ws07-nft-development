// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2021 Dominic Heil <d.heil@campus.tu-berlin.de>

import CenterFlexBox from "../components/CenterFlexBox";
import {
	Button,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableRow,
} from "@mui/material";
import React from "react";
import appwriteApi from "../api/appwriteApi";
import Grid from "@mui/material/Grid";
import useChangeRoute from "../hooks/useChangeRoute";

export default function Profile({ user, setUser }) {
	const changeRoute = useChangeRoute();

	return <CenterFlexBox>
		<Grid
			container
			spacing={2}
			alignItems="center"
			justifyContent="center"
			direction="column">
			<Grid item style={{ width: "100%" }}>
				<TableContainer  style={{ color: "white" }}>
					<Table>
						<TableBody>
							<TableRow>
								<TableCell style={{ color: "white", borderBottom: "none" }}>Name</TableCell>
								<TableCell style={{ color: "white", borderBottom: "none" }}>{user.name}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell style={{ color: "white", borderBottom: "none" }}>Email</TableCell>
								<TableCell style={{ color: "white", borderBottom: "none" }}>{user.email}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell style={{ color: "white", borderBottom: "none" }}>Email verified?</TableCell>
								<TableCell style={{ color: "white", borderBottom: "none" }}>{user.emailVerification ? "Yes" : <>No <span style={{ textDecorationLine: "underline", cursor: "pointer" }} onClick={() => appwriteApi.sendEmailConfirmation()}>Resent email verification</span></>}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell style={{ color: "white", borderBottom: "none" }}>Password</TableCell>
								<TableCell style={{ color: "white", borderBottom: "none" }}><Button variant="outlined" style={{ color: "white" }} onClick={() => changeRoute("/changePassword")}>Change password</Button></TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</TableContainer>
			</Grid>
			<Grid item>
				<Button
					variant="outlined" style={{ color: "red" }} onClick={() => appwriteApi.deleteCurrentSession().then(() =>
						setUser(null)
					)}>Logout</Button>
			</Grid>
		</Grid>

	</CenterFlexBox>;
}