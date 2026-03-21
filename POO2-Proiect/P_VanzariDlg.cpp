#include "pch.h"
#include "framework.h"
#include "P_Vanzari.h"
#include "P_VanzariDlg.h"
#include "afxdialogex.h"
#include <mysqlx/xdevapi.h>
#include <string>

#ifdef _DEBUG
#define new DEBUG_NEW
#endif

CPVanzariDlg::CPVanzariDlg(CWnd* pParent)
	: CDialogEx(IDD_P_VANZARI_DIALOG, pParent)
{
	m_hIcon = AfxGetApp()->LoadIcon(IDR_MAINFRAME);
	m_Produs = 0;
	m_valoareVanzari = 0.0;
	m_totalValoareAfisata = _T("");
	m_includeTVA = FALSE;
	m_includeReducere = FALSE;
	m_tvaProcent = 19.0f;
	m_reducereProcent = 0.0f;
	m_valoareFinala = 0.0f;
	m_clientFidel = FALSE;
	m_plataCard = FALSE;
	m_textCautare = _T("");
}

void CPVanzariDlg::DoDataExchange(CDataExchange* pDX)
{
	CDialogEx::DoDataExchange(pDX);
	DDX_Radio(pDX, IDC_ALIMENTARE, m_Produs);
	DDX_Text(pDX, IDC_EDIT_VALOARE, m_valoareVanzari);
	DDX_Control(pDX, IDC_LIST_VANZARI, m_listaVanzare);
	DDX_Text(pDX, IDC_STATIC_TOTAL, m_totalValoareAfisata);
	DDX_Check(pDX, IDC_CHECK_TVA, m_includeTVA);
	DDX_Check(pDX, IDC_CHECK_REDUCERE, m_includeReducere);
	DDX_Text(pDX, IDC_EDIT_TVA, m_tvaProcent);
	DDX_Text(pDX, IDC_EDIT_REDUCERE, m_reducereProcent);
	DDX_Check(pDX, IDC_CHECK_FIDEL, m_clientFidel);
	DDX_Check(pDX, IDC_CHECK_CARD, m_plataCard);
	DDX_Control(pDX, IDC_COMBO_MAGAZIN, m_comboMagazin);
	DDX_Control(pDX, IDC_LIST_TABEL, m_listTabel);
	DDX_Control(pDX, IDC_TREE_CATEGORII, m_treeCategorii);
	DDX_Text(pDX, IDC_EDIT_CAUTARE, m_textCautare);
}

BEGIN_MESSAGE_MAP(CPVanzariDlg, CDialogEx)
	ON_WM_SYSCOMMAND()
	ON_WM_PAINT()
	ON_WM_QUERYDRAGICON()
	ON_BN_CLICKED(IDC_ADAUGA_VANZARE, &CPVanzariDlg::OnBnClickedAdaugaVanzare)
	ON_BN_CLICKED(IDC_TOTAL, &CPVanzariDlg::OnBnClickedTotal)
	ON_BN_CLICKED(IDC_STERGE_VANZARE, &CPVanzariDlg::OnBnClickedStergeVanzare)
	ON_BN_CLICKED(IDC_CAUTA_VANZARE, &CPVanzariDlg::OnBnClickedCautaVanzare)
	ON_BN_CLICKED(IDC_EDIT_SELECTIE, &CPVanzariDlg::OnBnClickedEditSelectie)
END_MESSAGE_MAP()

void CPVanzariDlg::RefreshGrid()
{
	m_listTabel.DeleteAllItems();
	m_listaVanzare.ResetContent();

	HTREEITEM hRoot = m_treeCategorii.GetRootItem();
	if (hRoot) {
		HTREEITEM hChild = m_treeCategorii.GetChildItem(hRoot);
		while (hChild)
		{
			HTREEITEM hSub = m_treeCategorii.GetChildItem(hChild);
			while (hSub)
			{
				HTREEITEM hNext = m_treeCategorii.GetNextSiblingItem(hSub);
				m_treeCategorii.DeleteItem(hSub);
				hSub = hNext;
			}
			hChild = m_treeCategorii.GetNextSiblingItem(hChild);
		}
	}

	try {
		mysqlx::Session sess("localhost", 3306, "root", "");
		mysqlx::Schema db = sess.getSchema("gestiunevanzari");
		mysqlx::Table tbl = db.getTable("vanzari");

		mysqlx::RowResult res = tbl.select("id", "categorie", "valoare", "magazin", "fidel", "card").execute();

		for (mysqlx::Row row : res.fetchAll())
		{
			std::string cat = row[1].get<std::string>();
			float valoareBaza = (float)row[2].get<double>();
			std::string mag = row[3].get<std::string>();
			int fidel = row[4].get<int>();
			int card = row[5].get<int>();
			int id_db = row[0].get<int>();

			CString cCat(cat.c_str());
			CString cVal;
			cVal.Format(L"%.2f", valoareBaza);
			CString cMag(mag.c_str());

			int nIdx = m_listTabel.InsertItem(m_listTabel.GetItemCount(), cCat);
			m_listTabel.SetItemText(nIdx, 1, cVal);
			m_listTabel.SetItemText(nIdx, 2, cMag);
			m_listTabel.SetItemText(nIdx, 3, fidel ? L"Da" : L"Nu");
			m_listTabel.SetItemText(nIdx, 4, card ? L"Da" : L"Nu");
			m_listTabel.SetItemData(nIdx, (DWORD)id_db);

			m_listaVanzare.AddString(cCat + L" - " + cVal + L" lei");

			HTREEITEM hC = m_treeCategorii.GetChildItem(hRoot);
			while (hC)
			{
				if (m_treeCategorii.GetItemText(hC) == cCat)
				{
					m_treeCategorii.InsertItem(cMag + L" - " + cVal, hC);
					break;
				}
				hC = m_treeCategorii.GetNextSiblingItem(hC);
			}
		}
	}
	catch (...) {}
}

BOOL CPVanzariDlg::OnInitDialog()
{
	CDialogEx::OnInitDialog();
	SetIcon(m_hIcon, TRUE);
	SetIcon(m_hIcon, FALSE);

	m_comboMagazin.AddString(L"Auchan");
	m_comboMagazin.AddString(L"Kaufland");
	m_comboMagazin.AddString(L"Lidl");
	m_comboMagazin.SetCurSel(0);

	m_listTabel.SetExtendedStyle(LVS_EX_FULLROWSELECT | LVS_EX_GRIDLINES);
	m_listTabel.InsertColumn(0, L"Categorie", LVCFMT_LEFT, 100);
	m_listTabel.InsertColumn(1, L"Valoare", LVCFMT_LEFT, 80);
	m_listTabel.InsertColumn(2, L"Magazin", LVCFMT_LEFT, 120);
	m_listTabel.InsertColumn(3, L"Fidel", LVCFMT_LEFT, 60);
	m_listTabel.InsertColumn(4, L"Card", LVCFMT_LEFT, 60);

	HTREEITEM hRadacina = m_treeCategorii.InsertItem(L"Toate Vanzarile", TVI_ROOT);
	m_treeCategorii.InsertItem(L"Alimentare", hRadacina);
	m_treeCategorii.InsertItem(L"Nealimentare", hRadacina);
	m_treeCategorii.Expand(hRadacina, TVE_EXPAND);

	RefreshGrid();

	return TRUE;
}

void CPVanzariDlg::OnBnClickedAdaugaVanzare()
{
	UpdateData(TRUE);
	if (m_valoareVanzari <= 0) return;

	float valoareFinala = (float)m_valoareVanzari;
	if (m_includeTVA) valoareFinala += valoareFinala * (m_tvaProcent / 100.0f);
	if (m_includeReducere) valoareFinala -= valoareFinala * (m_reducereProcent / 100.0f);

	CString categorie = (m_Produs == 0) ? L"Alimentare" : L"Nealimentare";
	CString magazin;
	m_comboMagazin.GetLBText(m_comboMagazin.GetCurSel(), magazin);

	try {
		mysqlx::Session sess("localhost", 3306, "root", "");
		mysqlx::Schema db = sess.getSchema("gestiunevanzari");
		mysqlx::Table tbl = db.getTable("vanzari");

		tbl.insert("categorie", "valoare", "magazin", "fidel", "card")
			.values((std::string)CT2A(categorie), valoareFinala, (std::string)CT2A(magazin), m_clientFidel ? 1 : 0, m_plataCard ? 1 : 0)
			.execute();

		RefreshGrid();
	}
	catch (...) {
		AfxMessageBox(L"Eroare conectare MySQL!");
	}
	UpdateData(FALSE);
}

void CPVanzariDlg::OnBnClickedStergeVanzare()
{
	int nItem = m_listTabel.GetNextItem(-1, LVNI_SELECTED);
	if (nItem == -1) return;

	int id = (int)m_listTabel.GetItemData(nItem);

	try {
		mysqlx::Session sess("localhost", 3306, "root", "");
		mysqlx::Schema db = sess.getSchema("gestiunevanzari");
		mysqlx::Table tbl = db.getTable("vanzari");

		tbl.remove().where("id = " + std::to_string(id)).execute();
		RefreshGrid();
	}
	catch (...) {}
}

void CPVanzariDlg::OnBnClickedCautaVanzare()
{
	UpdateData(TRUE);
	if (m_textCautare.IsEmpty()) return;

	for (int i = 0; i < m_listTabel.GetItemCount(); i++)
	{
		if (m_listTabel.GetItemText(i, 2).Find(m_textCautare) != -1)
		{
			m_listTabel.SetItemState(i, LVIS_SELECTED, LVIS_SELECTED);
			m_listTabel.EnsureVisible(i, FALSE);
			return;
		}
	}
}

void CPVanzariDlg::OnBnClickedEditSelectie()
{
	int nItem = m_listTabel.GetNextItem(-1, LVNI_SELECTED);
	if (nItem == -1) return;

	m_valoareVanzari = _wtof(m_listTabel.GetItemText(nItem, 1));
	m_Produs = (m_listTabel.GetItemText(nItem, 0) == L"Alimentare") ? 0 : 1;
	m_clientFidel = (m_listTabel.GetItemText(nItem, 3) == L"Da");
	m_plataCard = (m_listTabel.GetItemText(nItem, 4) == L"Da");

	OnBnClickedStergeVanzare();
	UpdateData(FALSE);
}

void CPVanzariDlg::OnBnClickedTotal()
{
	double total = 0.0;
	for (int i = 0; i < m_listTabel.GetItemCount(); i++)
		total += _wtof(m_listTabel.GetItemText(i, 1));
	m_totalValoareAfisata.Format(L"Total: %.2f lei", total);
	UpdateData(FALSE);
}

void CPVanzariDlg::OnSysCommand(UINT nID, LPARAM lParam) { CDialogEx::OnSysCommand(nID, lParam); }
void CPVanzariDlg::OnPaint() { CDialogEx::OnPaint(); }
HCURSOR CPVanzariDlg::OnQueryDragIcon() { return static_cast<HCURSOR>(m_hIcon); }