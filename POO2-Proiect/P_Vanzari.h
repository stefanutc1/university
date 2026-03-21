
// P_Vanzari.h : main header file for the PROJECT_NAME application
//

#pragma once

#ifndef __AFXWIN_H__
	#error "include 'pch.h' before including this file for PCH"
#endif

#include "resource.h"		// main symbols


// CPVanzariApp:
// See P_Vanzari.cpp for the implementation of this class
//

class CPVanzariApp : public CWinApp
{
public:
	CPVanzariApp();

// Overrides
public:
	virtual BOOL InitInstance();

// Implementation

	DECLARE_MESSAGE_MAP()
};

extern CPVanzariApp theApp;
