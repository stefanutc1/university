
// laborator9MDI.h : main header file for the laborator9MDI application
//
#pragma once

#ifndef __AFXWIN_H__
	#error "include 'pch.h' before including this file for PCH"
#endif

#include "resource.h"       // main symbols


// Claborator9MDIApp:
// See laborator9MDI.cpp for the implementation of this class
//

class Claborator9MDIApp : public CWinAppEx
{
public:
	Claborator9MDIApp() noexcept;


// Overrides
public:
	virtual BOOL InitInstance();
	virtual int ExitInstance();

// Implementation
	UINT  m_nAppLook;
	BOOL  m_bHiColorIcons;

	virtual void PreLoadState();
	virtual void LoadCustomState();
	virtual void SaveCustomState();

	afx_msg void OnAppAbout();
	DECLARE_MESSAGE_MAP()
};

extern Claborator9MDIApp theApp;
