
// laborator5.h : main header file for the PROJECT_NAME application
//

#pragma once

#ifndef __AFXWIN_H__
	#error "include 'pch.h' before including this file for PCH"
#endif

#include "resource.h"		// main symbols


// Claborator5App:
// See laborator5.cpp for the implementation of this class
//

class Claborator5App : public CWinApp
{
public:
	Claborator5App();

// Overrides
public:
	virtual BOOL InitInstance();

// Implementation

	DECLARE_MESSAGE_MAP()
};

extern Claborator5App theApp;
