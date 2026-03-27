
// laborator5Dlg.cpp : implementation file
//

#include "pch.h"
#include "framework.h"
#include "laborator5.h"
#include "laborator5Dlg.h"
#include "afxdialogex.h"

#ifdef _DEBUG
#define new DEBUG_NEW
#endif


// CAboutDlg dialog used for App About

class CAboutDlg : public CDialogEx
{
public:
	CAboutDlg();

// Dialog Data
#ifdef AFX_DESIGN_TIME
	enum { IDD = IDD_ABOUTBOX };
#endif

	protected:
	virtual void DoDataExchange(CDataExchange* pDX);    // DDX/DDV support

// Implementation
protected:
	DECLARE_MESSAGE_MAP()
};

CAboutDlg::CAboutDlg() : CDialogEx(IDD_ABOUTBOX)
{
}

void CAboutDlg::DoDataExchange(CDataExchange* pDX)
{
	CDialogEx::DoDataExchange(pDX);
}

BEGIN_MESSAGE_MAP(CAboutDlg, CDialogEx)
END_MESSAGE_MAP()


// Claborator5Dlg dialog



Claborator5Dlg::Claborator5Dlg(CWnd* pParent /*=nullptr*/)
	: CDialogEx(IDD_LABORATOR5_DIALOG, pParent)
{
	m_hIcon = AfxGetApp()->LoadIcon(IDR_MAINFRAME);
}

void Claborator5Dlg::DoDataExchange(CDataExchange* pDX)
{
	CDialogEx::DoDataExchange(pDX);
	DDX_Control(pDX, IDC_ICON_1, m_icon1);
	DDX_Control(pDX, IDC_ICON_2, m_icon2);
	DDX_Control(pDX, IDC_ICON_3, m_icon3);
	DDX_Control(pDX, IDC_ICON_4, m_icon4);
	DDX_Control(pDX, IDC_ICON_5, m_icon5);
	DDX_Control(pDX, IDC_ICON_6, m_icon6);
	DDX_Control(pDX, IDC_ICON_7, m_icon7);
	DDX_Control(pDX, IDC_ICON_8, m_icon8);
}

BEGIN_MESSAGE_MAP(Claborator5Dlg, CDialogEx)
	ON_WM_SYSCOMMAND()
	ON_WM_PAINT()
	ON_WM_QUERYDRAGICON()
END_MESSAGE_MAP()


// Claborator5Dlg message handlers

BOOL Claborator5Dlg::OnInitDialog()
{
	CDialogEx::OnInitDialog();

	// Add "About..." menu item to system menu.

	// IDM_ABOUTBOX must be in the system command range.
	ASSERT((IDM_ABOUTBOX & 0xFFF0) == IDM_ABOUTBOX);
	ASSERT(IDM_ABOUTBOX < 0xF000);

	CMenu* pSysMenu = GetSystemMenu(FALSE);
	if (pSysMenu != nullptr)
	{
		BOOL bNameValid;
		CString strAboutMenu;
		bNameValid = strAboutMenu.LoadString(IDS_ABOUTBOX);
		ASSERT(bNameValid);
		if (!strAboutMenu.IsEmpty())
		{
			pSysMenu->AppendMenu(MF_SEPARATOR);
			pSysMenu->AppendMenu(MF_STRING, IDM_ABOUTBOX, strAboutMenu);
		}
	}

	CWinApp* pApp = AfxGetApp();
	HICON hIcon;
	// ** Incarcam pictograma aplicatiei si
	// ** atasam la controlul imagine pictograma incarcata
	hIcon = pApp->LoadIcon(IDR_MAINFRAME);
	m_icon1.SetIcon(hIcon);
	// ** Incarcam cateva pictograme standard si
	// ** le atasam la fiecare dintre controalele imagine
	hIcon = pApp->LoadStandardIcon(IDI_HAND);
	m_icon2.SetIcon(hIcon);
	hIcon = pApp->LoadStandardIcon(IDI_QUESTION);
	m_icon3.SetIcon(hIcon);
	hIcon = pApp->LoadStandardIcon(IDI_EXCLAMATION);
	m_icon4.SetIcon(hIcon);
	hIcon = pApp->LoadStandardIcon(IDI_ASTERISK);
	m_icon5.SetIcon(hIcon);
	hIcon = pApp->LoadStandardIcon(IDI_ERROR);
	m_icon6.SetIcon(hIcon);
	hIcon = pApp->LoadStandardIcon(IDI_INFORMATION);
	m_icon7.SetIcon(hIcon);
	hIcon = pApp->LoadStandardIcon(IDI_WARNING);
	m_icon8.SetIcon(hIcon);

	// Set the icon for this dialog.  The framework does this automatically
	//  when the application's main window is not a dialog
	SetIcon(m_hIcon, TRUE);			// Set big icon
	SetIcon(m_hIcon, FALSE);		// Set small icon

	// TODO: Add extra initialization here

	return TRUE;  // return TRUE  unless you set the focus to a control
}

void Claborator5Dlg::OnSysCommand(UINT nID, LPARAM lParam)
{
	if ((nID & 0xFFF0) == IDM_ABOUTBOX)
	{
		CAboutDlg dlgAbout;
		dlgAbout.DoModal();
	}
	else
	{
		CDialogEx::OnSysCommand(nID, lParam);
	}
}

// If you add a minimize button to your dialog, you will need the code below
//  to draw the icon.  For MFC applications using the document/view model,
//  this is automatically done for you by the framework.

void Claborator5Dlg::OnPaint()
{
	if (IsIconic())
	{
		CPaintDC dc(this); // device context for painting

		SendMessage(WM_ICONERASEBKGND, reinterpret_cast<WPARAM>(dc.GetSafeHdc()), 0);

		// Center icon in client rectangle
		int cxIcon = GetSystemMetrics(SM_CXICON);
		int cyIcon = GetSystemMetrics(SM_CYICON);
		CRect rect;
		GetClientRect(&rect);
		int x = (rect.Width() - cxIcon + 1) / 2;
		int y = (rect.Height() - cyIcon + 1) / 2;

		// Draw the icon
		dc.DrawIcon(x, y, m_hIcon);
	}
	else
	{
		CDialogEx::OnPaint();
	}
}

// The system calls this function to obtain the cursor to display while the user drags
//  the minimized window.
HCURSOR Claborator5Dlg::OnQueryDragIcon()
{
	return static_cast<HCURSOR>(m_hIcon);
}

