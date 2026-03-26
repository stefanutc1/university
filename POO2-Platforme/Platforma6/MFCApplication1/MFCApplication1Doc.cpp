// MFCApplication1Doc.cpp : implementation of the CMFCApplication1Doc class
//
#include "pch.h"
#include "framework.h"
#include "MFCApplication1.h"
#include "MFCApplication1Doc.h"
#include <propkey.h>

#ifdef _DEBUG
#define new DEBUG_NEW
#endif

IMPLEMENT_DYNCREATE(CMFCApplication1Doc, CDocument)

BEGIN_MESSAGE_MAP(CMFCApplication1Doc, CDocument)
	ON_COMMAND(ID_ADAUGARE_DOSAR, &CMFCApplication1Doc::OnAdaugareDosar)
	ON_COMMAND(ID_STERGE_DOSAR, &CMFCApplication1Doc::OnStergeDosar)
END_MESSAGE_MAP()

CMFCApplication1Doc::CMFCApplication1Doc() noexcept {
	m_Doc = 0;
}

CMFCApplication1Doc::~CMFCApplication1Doc() {
}

BOOL CMFCApplication1Doc::OnNewDocument() {
	if (!CDocument::OnNewDocument())
		return FALSE;
	return TRUE;
}

void CMFCApplication1Doc::DeleteContents() {
	m_Doc = 1;
	CDocument::DeleteContents();
}

int CMFCApplication1Doc::GetDosareCount() {
	return m_Doc;
}

void CMFCApplication1Doc::OnAdaugareDosar() {
	m_Doc++;
	UpdateAllViews(NULL);
}

void CMFCApplication1Doc::OnStergeDosar() {
	if (m_Doc > 0) {
		m_Doc--;
		UpdateAllViews(NULL);
	}
}

void CMFCApplication1Doc::Serialize(CArchive& ar) {
	if (ar.IsStoring()) {}
	else {}
}
#ifdef _DEBUG
void CMFCApplication1Doc::AssertValid() const
{
	CDocument::AssertValid();
}

void CMFCApplication1Doc::Dump(CDumpContext& dc) const
{
	CDocument::Dump(dc);
}
#endif //_DEBUG