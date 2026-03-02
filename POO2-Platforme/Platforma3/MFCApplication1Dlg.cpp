#include "pch.h"
#include "framework.h"
#include "MFCApplication1.h"
#include "MFCApplication1Dlg.h"
#include "afxdialogex.h"

#ifdef _DEBUG
#define new DEBUG_NEW
#endif

BEGIN_MESSAGE_MAP(CMFCApplication1Dlg, CDialogEx)
	ON_WM_SYSCOMMAND()
	ON_WM_PAINT()
	ON_WM_QUERYDRAGICON()
	ON_BN_CLICKED(IDC_VIZIBIL_INVIZIBIL, &CMFCApplication1Dlg::OnBnClickedVizibilInvizibil)
	ON_BN_CLICKED(IDC_ACTIV_INACTIV, &CMFCApplication1Dlg::OnBnClickedActivInactiv)
	ON_BN_CLICKED(IDC_STANG, &CMFCApplication1Dlg::OnBnClickedStang)
	ON_BN_CLICKED(IDC_CENTRU, &CMFCApplication1Dlg::OnBnClickedCentru)
	ON_BN_CLICKED(IDC_DREPT, &CMFCApplication1Dlg::OnBnClickedDrept)
END_MESSAGE_MAP()

CMFCApplication1Dlg::CMFCApplication1Dlg(CWnd* pParent /*=nullptr*/)
	: CDialogEx(IDD_MFCAPPLICATION1_DIALOG, pParent)
{
	m_hIcon = AfxGetApp()->LoadIcon(IDR_MAINFRAME);
	m_nIDofLastButton = 0; 
}

void CMFCApplication1Dlg::DoDataExchange(CDataExchange* pDX)
{
	CDialogEx::DoDataExchange(pDX);
}

BOOL CMFCApplication1Dlg::OnInitDialog()
{
	CDialogEx::OnInitDialog();
	SetIcon(m_hIcon, TRUE);
	SetIcon(m_hIcon, FALSE);
	return TRUE;
}

void CMFCApplication1Dlg::OnBnClickedVizibilInvizibil()
{
	CWnd* pStang = GetDlgItem(IDC_STANG);
	if (pStang != nullptr)
	{
		BOOL bVisible = pStang->IsWindowVisible();
		GetDlgItem(IDC_STANG)->ShowWindow(bVisible ? SW_HIDE : SW_SHOW);
		GetDlgItem(IDC_CENTRU)->ShowWindow(bVisible ? SW_HIDE : SW_SHOW);
		GetDlgItem(IDC_DREPT)->ShowWindow(bVisible ? SW_HIDE : SW_SHOW);
		GetDlgItem(IDC_VIZIBIL_INVIZIBIL)->SetWindowText(bVisible ? L"Vizibil" : L"Invizibil");
	}
}

void CMFCApplication1Dlg::OnBnClickedActivInactiv()
{
	CWnd* pStang = GetDlgItem(IDC_STANG);
	if (pStang != nullptr)
	{
		BOOL bEnabled = pStang->IsWindowEnabled();
		GetDlgItem(IDC_STANG)->EnableWindow(!bEnabled);
		GetDlgItem(IDC_CENTRU)->EnableWindow(!bEnabled);
		GetDlgItem(IDC_DREPT)->EnableWindow(!bEnabled);
		GetDlgItem(IDC_ACTIV_INACTIV)->SetWindowText(!bEnabled ? L"Inactiv" : L"Activ");
	}
}

void CMFCApplication1Dlg::ChangeDialogTitle(unsigned int nID)
{
	CString strCaption;
	GetDlgItem(nID)->GetWindowText(strCaption);
	strCaption += L" was pressed";

	if (m_nIDofLastButton == nID)
		strCaption += L" again";

	SetWindowText(strCaption);
	m_nIDofLastButton = nID;
}

void CMFCApplication1Dlg::OnBnClickedStang() { ChangeDialogTitle(IDC_STANG); }
void CMFCApplication1Dlg::OnBnClickedCentru() { ChangeDialogTitle(IDC_CENTRU); }
void CMFCApplication1Dlg::OnBnClickedDrept() { ChangeDialogTitle(IDC_DREPT); }

void CMFCApplication1Dlg::OnSysCommand(UINT nID, LPARAM lParam) { CDialogEx::OnSysCommand(nID, lParam); }
void CMFCApplication1Dlg::OnPaint() {
	if (IsIconic()) {
		CPaintDC dc(this);
		SendMessage(WM_ICONERASEBKGND, reinterpret_cast<WPARAM>(dc.GetSafeHdc()), 0);
		dc.DrawIcon((GetSystemMetrics(SM_CXICON)) / 2, (GetSystemMetrics(SM_CYICON)) / 2, m_hIcon);
	}
	else CDialogEx::OnPaint();
}
HCURSOR CMFCApplication1Dlg::OnQueryDragIcon() { return static_cast<HCURSOR>(m_hIcon); }