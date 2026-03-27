
// laborator5Dlg.h : header file
//

#pragma once


// Claborator5Dlg dialog
class Claborator5Dlg : public CDialogEx
{
// Construction
public:
	Claborator5Dlg(CWnd* pParent = nullptr);	// standard constructor

// Dialog Data
#ifdef AFX_DESIGN_TIME
	enum { IDD = IDD_LABORATOR5_DIALOG };
#endif

	protected:
	virtual void DoDataExchange(CDataExchange* pDX);	// DDX/DDV support


// Implementation
protected:
	HICON m_hIcon;

	// Generated message map functions
	virtual BOOL OnInitDialog();
	afx_msg void OnSysCommand(UINT nID, LPARAM lParam);
	afx_msg void OnPaint();
	afx_msg HCURSOR OnQueryDragIcon();
	DECLARE_MESSAGE_MAP()
public:
	CStatic m_icon1;
	CStatic m_icon2;
	CStatic m_icon3;
	CStatic m_icon4;
	CStatic m_icon5;
	CStatic m_icon6;
	CStatic m_icon7;
	CStatic m_icon8;
};
