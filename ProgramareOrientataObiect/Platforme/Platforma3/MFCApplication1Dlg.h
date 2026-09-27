#pragma once

class CMFCApplication1Dlg : public CDialogEx
{
public:
	CMFCApplication1Dlg(CWnd* pParent = nullptr);

#ifdef AFX_DESIGN_TIME
	enum { IDD = IDD_MFCAPPLICATION1_DIALOG };
#endif

protected:
	virtual void DoDataExchange(CDataExchange* pDX);

protected:
	HICON m_hIcon;
	unsigned int m_nIDofLastButton; // variabila pentru reținerea ultimului buton 

	// funcții de sistem
	virtual BOOL OnInitDialog();
	afx_msg void OnSysCommand(UINT nID, LPARAM lParam);
	afx_msg void OnPaint();
	afx_msg HCURSOR OnQueryDragIcon();

	// funcții de tratare evenimente (handlers) [cite: 105, 171]
	afx_msg void OnBnClickedVizibilInvizibil();
	afx_msg void OnBnClickedActivInactiv();
	afx_msg void OnBnClickedStang();
	afx_msg void OnBnClickedCentru();
	afx_msg void OnBnClickedDrept();

	// funcție auxiliară pentru titlu [cite: 172, 202]
	void ChangeDialogTitle(unsigned int nID);

	DECLARE_MESSAGE_MAP()
};