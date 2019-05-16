; Scripts for Notepad++
; Written by Munawar Bijani
include "hjconst.jsh";
globals
	string indentMSG;
Int Function announceTabs ()
	var
		string msg,
		int currentCharacter,
		int numTabs,
		int numSpaces;
	; First, we'll use the invisible cursor to save the location of the PC Cursor.
	; This is because we move the PC Cursor in order to get the indent count.
	invisibleCursor();
	routeInvisibleToPc ();
	PCCursor();
	; Announcing the indent on a blank line is a waste.
	if (StringIsBlank(getLine())) then
		routePCToInvisible();
		indentMsg = "";
		return 1;
	EndIf
	JAWSHome();
	currentCharacter = GetCharacterValue (getCharacter());
	if (currentCharacter != 0 && currentCharacter != 9 && currentCharacter != 32) then
		; Some editors position the cursor at the beginning of a line on the first press of home. This is the case with Notepad++
		JAWSHome();
		currentCharacter = getCharacterValue(getCharacter());
	EndIf
	while (currentCharacter == 0 || currentCharacter == 9 || currentCharacter == 32)
		; JAWS sees tab characters as null characters, so we'll treat all nulls and character(9)'s as tabs, though character(9) might never occur.
		if (currentCharacter == 0 || currentCharacter == 9) then
			numTabs = numTabs + 1;
		else
			numSpaces = numSpaces + 1;
		EndIf
		nextCharacter();
		currentCharacter = getCharacterValue(getCharacter());
	EndWhile
	if (numTabs > 0) then
		msg = intToString(numTabs) + " tab";
		if (numTabs > 1) then
			msg = msg + "s";
		EndIf
	EndIf
	if (numSpaces > 0) then
		if (msg != "") then
			msg = msg + " and ";
		EndIf
		msg = msg + intToString(numSpaces) + " space";
		if (numSpaces > 1) then
			msg = msg + "s";
		endIf
	EndIf
	if (msg == "") then
		msg = "No indent";
	EndIf
	if (msg != indentMSG) then
		sayUsingVoice (VCTX_MESSAGE, msg, OT_STATUS);
		indentMSG = msg;
	EndIf
	; Finally, restore the PC Cursor. We left the Invisible Cursor at the PC Cursor's previous position so we can simply route it back.
	routePcToInvisible ();
	return 1;
EndFunction

Script QuickSettings ()
	var
		int announceIndent;
	PerformScript QuickSettings();
	announceIndent = GetJCFOptionFromFile ("NonJCFOptions", "NotepadPPIndent");
	if (announceIndent) then
		SetJCFOption (OPT_INDICATE_INDENTATION, 0);
	EndIf
EndScript


Int Function isInTextEditor ()
var
		int cond;
	cond =  IsPCCursor () && GetJCFOptionFromFile ("NonJCFOptions", "NotepadPPIndent") && GetWindowClass (GetFocus()) == "Scintilla";
	; Next, if we've turned on custom indent behavior, we'll turn off the JAWS default indent behavior for Notepad++ if it's on.
	if (cond && GetJCFOption (OPT_INDICATE_INDENTATION)) then
		SetJCFOption (OPT_INDICATE_INDENTATION, 0);
	endIf
	return cond;
EndFunction


Script SayPriorLine ()
	if (isInTextEditor()) then
		PriorLine();
		announceTabs();
		sayLine();
	else
		performScript sayPriorLine();
	EndIf
EndScript

Script SayNextLine ()
	if (isInTextEditor()) then
		NextLine();
		announceTabs();
		sayLine();
	else
		PerformScript SayNextLine();
	EndIf
EndScript