#pragma once

#include <mysqlx/xdevapi.h>

class CPVanzariDlg : public CDialogEx
{
public:
	CPVanzariDlg(CWnd* pParent = nullptr);

	void RefreshGrid();

#ifdef AFX_DESIGN_TIME
	enum { IDD = IDD_P_VANZARI_DIALOG };
#endif

protected:
	virtual void DoDataExchange(CDataExchange* pDX);

public:
	int m_Produs;
	double m_valoareVanzari;
	CListBox m_listaVanzare;
	CString m_totalValoareAfisata;

	BOOL m_includeTVA;
	BOOL m_includeReducere;
	float m_tvaProcent;
	float m_reducereProcent;
	float m_valoareFinala;

	BOOL m_clientFidel;
	BOOL m_plataCard;

	CComboBox m_comboMagazin;
	CListCtrl m_listTabel;
	CTreeCtrl m_treeCategorii;

	CString m_textCautare;

protected:
	HICON m_hIcon;

	virtual BOOL OnInitDialog();
	afx_msg void OnSysCommand(UINT nID, LPARAM lParam);
	afx_msg void OnPaint();
	afx_msg HCURSOR OnQueryDragIcon();
	afx_msg void OnBnClickedAdaugaVanzare();
	afx_msg void OnBnClickedTotal();
	afx_msg void OnBnClickedStergeVanzare();
	afx_msg void OnBnClickedCautaVanzare();
	afx_msg void OnBnClickedEditSelectie();

	DECLARE_MESSAGE_MAP()
};