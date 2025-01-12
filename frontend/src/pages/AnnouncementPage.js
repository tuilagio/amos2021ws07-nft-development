// SPDX-License-Identifier: MIT
// SDPX-FileCopyrightText: 2021 Que Le <b.le@tu-berlin.de>

import React, {
	useEffect,
	useState
} from "react";
import appwriteApi from "../api/appwriteApi";
import useChangeRoute from "../hooks/useChangeRoute";
import { Link as RouterLink, useLocation } from "react-router-dom";

import Grid from "@mui/material/Grid";
import { Button, Alert, TextField, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Link from "@mui/material/Link";

import RoundedEdgesButton from "../components/RoundedEdgesButton";
import HeaderTypography from "../components/HeaderTypography";
import ParagraphTypography from "../components/ParagraphTypography";

import examplePhoto1 from "../assets/img/announcementPhotoExamples/anouncement_1.png";
import examplePhoto2 from "../assets/img/announcementPhotoExamples/anouncement_2.png";
import examplePhoto3 from "../assets/img/announcementPhotoExamples/anouncement_3.png";
import examplePhoto4 from "../assets/img/announcementPhotoExamples/anouncement_4.png";
import examplePhoto5 from "../assets/img/announcementPhotoExamples/anouncement_5.png";

const photos = [examplePhoto1, examplePhoto2, examplePhoto3, examplePhoto4, examplePhoto5];

function InputFields({ defaultTitle, defaultContent, titleComponenId, contentComponenId }) {
	// TODO: formated text support
	// ref: https://mui.com/components/text-fields/#integration-with-3rd-party-input-libraries
	return <Grid sx={{ mt: 3, marginBottom: 3 }}>
		<Grid item xs={12}>
			<TextField
				required
				fullWidth
				name="title"
				label="Title"
				id={titleComponenId}
				defaultValue={defaultTitle}
				multiline
				minRows={1}
				maxRows={10}
				sx={{ mt: 1, marginBottom: 1 }}
			/>
		</Grid>
		<Grid item xs={12}>
			<TextField
				required
				fullWidth
				name="content"
				label="Content"
				id={contentComponenId}
				defaultValue={defaultContent}
				multiline
				minRows={1}
				maxRows={10}
				sx={{ mt: 1, marginBottom: 1 }}
			/>
		</Grid>
	</Grid>;
}

function AnnouncementEntry({
	announcement, editing, setEditing, userIsAdmin, setAnnouncementsAreUpToDate, isSidebar
}) {

	const handleEditButton = id => () => {
		setEditing(id);
	};

	const changeRoute = useChangeRoute();

	const handleDeleteButton = id => () => {
		appwriteApi.deleteAnnouncement(id)
			.then(() => {
				setAnnouncementsAreUpToDate(false);
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const handleCancelButton = () => {
		setEditing("");
		if (window.location.hash.split("#")[1]) {
			changeRoute("/announcements");
		}
	};

	const handleSubmitButton = (announcementId, titleComponenId, contentComponenId) => () => {
		const title = document.getElementById(titleComponenId);
		const content = document.getElementById(contentComponenId);
		if (title.value.length == 0 || content.value.length == 0) {
			console.log("missing input or content!");
			return;
		}
		// Note: js get Unix time in Milisecond. Backend uses Python which utilizes *second, 
		// so for consistency we store all time in seconds 
		appwriteApi.updateAnnouncement({
			"title": title.value,
			"content": content.value,
			"updated_at": new Date().valueOf() / 1000 | 0
		}, announcementId)
			.then(() => {
				setAnnouncementsAreUpToDate(false);
				if (window.location.hash.split("#")[1]) {
					changeRoute("/announcements");
				}
			})
			.catch((e) => {
				console.log(e);
			});
	};

	/* Prepare datetime */
	const created_at = new Date(announcement.created_at * 1000);
	const formated_created_at = created_at.toString().substring(4,16);

	const limitLines = isSidebar ? {
		display: "-webkit-box",
		overflow: "hidden",
		WebkitBoxOrient: "vertical",
		WebkitLineClamp: 2,
	} : {};

	const boxPageStyle = { display: "flex", mt: 1, marginBottom: 3, p: 1, border: 1, borderColor: "rgba(255, 255, 255, 0.1)" };
	const titleStyle = { fontFamily: "Montserrat", fontSize: "14px", fontStyle: "normal", fontWeight: "bold" };
	const dateStyle = {
		fontFamily: "Noto Sans", fontSize: "11px", fontStyle: "normal",
		fontWeight: "medium", opacity: 0.4
	};
	const contentStyle = {
		fontFamily: "Noto Sans", fontSize: "12px",
		fontStyle: "normal", fontWeight: "medium",
		color: "rgba(255, 255, 255, 0.81)"
	};
	const linkStyle = {
		fontFamily: "PT Sans", fontSize: "12px",
		fontStyle: "normal", fontWeight: "medium",
		color: "#ffffff", textDecoration: "underline",
	};
	const announcePhoto = photos[parseInt(announcement.$id, 16) % photos.length];

	let adminControls = "";
	if (userIsAdmin) {
		adminControls = <>
			|&nbsp;&nbsp;
			<Typography onClick={handleDeleteButton(announcement.$id)} style={linkStyle}>
				Delete &#x2715;
			</Typography>
			&nbsp; | &nbsp;
			<RouterLink to={"/announcements#" + announcement.$id} style={linkStyle} >
				Edit &#9881;
			</RouterLink>
		</>;
	}

	const sidebarComponents =
		<div style={{ marginBottom: "2px" }}>
			<Box>
				<Grid container spacing={0} sx={{ maxWidth: "sm" }}>
					<Grid item xs={9}>
						<Link href="/announcements" style={{}}>
							<div style={{ backgroundImage: `url(${announcePhoto})`, backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundPosition: "center", width: "126px", height: "100px", borderRadius: "10px", }} />
						</Link>
					</Grid>
					<Grid
						item xs
						sx={{
							minHeight: "100px", marginLeft: "8px", paddingLeft: 0, paddingBottom: "10px", borderBottom: 1,
							borderColor: "rgba(255, 255, 255, 0.1)", marginBottom: 2,
						}}
					>
						<HeaderTypography style={titleStyle} sx={limitLines} variant="h5">
							{announcement.title}
						</HeaderTypography>
						<Box style={{ display: "flex", flexDirection: "row", marginBottom: 1, marginTop: 5 }}>
							<Typography style={dateStyle} sx={{ marginBottom: 1 }}>
								{formated_created_at}&nbsp;&nbsp;&nbsp;&nbsp;
							</Typography>
							{adminControls}
						</Box>
						<ParagraphTypography style={contentStyle} sx={limitLines}>
							{announcement.content}
						</ParagraphTypography>
						<Typography component={RouterLink} to={`/announcements#${announcement.$id}`} style={linkStyle}>Read more</Typography>
					</Grid>
				</Grid>
			</Box>
		</div>;
	
	if (isSidebar)
		return sidebarComponents;

	const pageComponents =
		<div style={{ width: "100%" }}>
			<Box xs={12} sx={boxPageStyle}>
				<div style={{ width: "100%", padding: 5 }}>
					<Typography style={titleStyle} sx={limitLines} variant="h5">
						{announcement.title}
					</Typography>
					<Typography style={dateStyle} sx={{ marginBottom: 1 }}>{formated_created_at}</Typography>
					<Typography style={contentStyle} sx={{ marginBottom: 1 }, limitLines}>
						{announcement.content}
					</Typography>
					{userIsAdmin
						?
						<div style={{ textAlign: "center", marginTop: 3 }}>
							<Button onClick={handleDeleteButton(announcement.$id)} variant="outlined" sx={{ m: 1 }}>
								Delete
							</Button>
							<Button onClick={handleEditButton(announcement.$id)} variant="outlined" sx={{ m: 1 }}>
								Edit
							</Button>
						</div>
						:
						<></>
					}
				</div>
			</Box>
			{/* Add edit Collapse component for each Announcement entry if user is admin */}
			{userIsAdmin
				?
				<>
					<Collapse in={editing == announcement.$id ? true : false}>
						<Box sx={{ m: 2, p: 2, backgroundColor: "#FFFFFF", borderRadius: "15px" }}>
							<InputFields
								defaultTitle={announcement.title}
								defaultContent={announcement.content}
								titleComponenId={"edit_title_" + announcement.$id}
								contentComponenId={"edit_content_" + announcement.$id}
							/>
							<div style={{ textAlign: "center" }}>
								<Button
									onClick={handleSubmitButton(
										announcement.$id,
										"edit_title_" + announcement.$id,
										"edit_content_" + announcement.$id
									)}
									variant="contained" sx={{ ma: 2 }}
								>
									Submit
								</Button>
								<Button onClick={handleCancelButton} variant="contained" sx={{ m: 2 }}>
									Cancel
								</Button>
							</div>
						</Box>
					</Collapse>
				</>
				:
				<></>
			}
		</div>;

	return pageComponents;
}

function AnnouncementContainer({
	announcements, editing, setEditing, userIsAdmin, setAnnouncementsAreUpToDate, isSidebar
}) {
	// Sort announcements by created_at (most recent displayed first).
	// Copied from https://stackoverflow.com/a/8837511
	announcements.sort(function (a, b) {
		let dateA = new Date(a.created_at),
			dateB = new Date(b.created_at);
		if (dateA > dateB) return -1;
		if (dateA < dateB) return 1;
		return 0;
	});
	return <div>
		{announcements.map((announcement, index) => {
			announcement["index"] = index;
			return <div id={"c" + announcement.$id} key={announcement.$id}>
				<AnnouncementEntry
					announcement={announcement}
					editing={editing}
					setEditing={setEditing}
					userIsAdmin={userIsAdmin}
					setAnnouncementsAreUpToDate={setAnnouncementsAreUpToDate}
					isSidebar={isSidebar}
				/>
			</div>;
		})}
	</div>;
}

/**
 * Component to view announcements.
 * For admin: add and edit announcements.
 * @param user user object of the currently logged in user/admin
 * @param isSidebar true if this component is used in sidebar. Less feature will be rendered.
 * @returns {JSX.Element}
 */
export default function AnnouncementPage(user, isSidebar) {
	// This is to force reloading page after adding a new announcement
	const [announcementsFromServer, setAnnouncementsFromServer] = useState([]);
	const [announcementsAreUpToDate, setAnnouncementsAreUpToDate] = useState(false);
	const [errorMessageAddAnnouncement, setErrorMessageAddAnnouncement] = useState("");
	const [errorMessageGetAnnouncement, setErrorMessageGetAnnouncement] = useState("");
	const [userIsAdmin, setUserIsAdmin] = useState(false);

	const [editing, setEditing] = useState("");

	const getAnnouncementsFromServer = () => {
		if (!announcementsAreUpToDate) {
			appwriteApi.getAnnouncements()
				.then((result) => {
					setAnnouncementsAreUpToDate(true);
					setAnnouncementsFromServer(result.documents);
				})
				.catch((e) => {
					setErrorMessageGetAnnouncement("Error getting announcement from server:");
					console.log(e);
				});
		}
	};

	useEffect(() => {
		getAnnouncementsFromServer();
		if (user && user.user) {
			appwriteApi.userIsMemberOfTeam("Admins")
				.then(isAdmin => setUserIsAdmin(isAdmin));
		} else {
			setUserIsAdmin(false);
		}
	});

	const clearInputFields = () => {
		document.getElementById("titleInputText").value = "";
		document.getElementById("contentInputText").value = "";
	};

	const handleClearButton = () => {
		clearInputFields();
	};

	const handleSubmitButton = () => {
		const title = document.getElementById("titleInputText");
		const content = document.getElementById("contentInputText");
		if (title.value.length == 0 || content.value.length == 0) {
			console.log("missing input or content!");
			return;
		}
		const now = new Date().valueOf() / 1000 | 0;
		appwriteApi.createAnnouncement({
			"title": title.value,
			"content": content.value,
			"created_at": now,
			"updated_at": now
		})
			.then(() => {
				setAnnouncementsAreUpToDate(false);
				clearInputFields();
			})
			.catch((e) => {
				setErrorMessageAddAnnouncement("Error adding announcement to server");
				console.log(e);
			});
	};

	function startup() {
		if (isSidebar && useLocation().pathname === "/announcements") {
			isSidebar = false;
		}
		const locationHash = window.location.hash.split("#");
		if (locationHash[1] && editing === "") {
			setEditing(locationHash[1]);
		}
	}
	startup();

	function AddAnnouncement() {
		return <Box sx={{ m: 0, p: 2 }}>
			<HeaderTypography variant="h4" sx={{ margin: 2 }}>Add a new announcement</HeaderTypography>
			<Box sx={{ m: 2, p: 2, backgroundColor: "#FFFFFF", borderRadius: "15px" }}>
				<InputFields
					titleComponenId="titleInputText"
					contentComponenId="contentInputText"
				/>
				<div style={{ textAlign: "center" }}>
					<Button onClick={handleClearButton} variant="contained" sx={{ m: 2 }}>
						Clear
					</Button>
					<Button onClick={handleSubmitButton} variant="contained" sx={{ m: 2 }}>
						Submit
					</Button>
				</div>
			</Box>
		</Box>;
	}

	const fullWidth = isSidebar ? {} : {
		margin: "auto", width: "70%"
	};

	return <div component="main" style={fullWidth}>
		{userIsAdmin && !isSidebar
			?
			<>
				<AddAnnouncement />
				{errorMessageAddAnnouncement !== "" && <Grid item xs={12}>
					<Alert severity="error">{errorMessageAddAnnouncement}</Alert>
				</Grid>}
				{errorMessageGetAnnouncement !== "" && <Grid item xs={12}>
					<Alert severity="error">{errorMessageGetAnnouncement}</Alert>
				</Grid>}
			</>
			:
			<></>
		}
		<Box sx={{ ml: 4, p: 0 }}>
			{isSidebar
				?
				<RoundedEdgesButton color="inherit" component={RouterLink} to="/announcements" style={{ padding: "0px", marginBottom: 22 }}>
					<HeaderTypography style={{ fontFamily: "Montserrat", fontSize: 20, fontWeight: "bold" }}>
						Announcements
					</HeaderTypography>
				</RoundedEdgesButton>
				:
				<HeaderTypography sx={{ mt: 2, marginBottom: 2 }} variant="h4">Announcements</HeaderTypography>
			}
			<AnnouncementContainer
				announcements={announcementsFromServer}
				editing={editing} setEditing={setEditing}
				userIsAdmin={userIsAdmin}
				setAnnouncementsAreUpToDate={setAnnouncementsAreUpToDate}
				isSidebar={isSidebar}
			/>
		</Box>
	</div>;
}