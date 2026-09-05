
// laborator9MDIDoc.cpp : implementation of the Claborator9MDIDoc class
//

#include "pch.h"
#include "framework.h"
// SHARED_HANDLERS can be defined in an ATL project implementing preview, thumbnail
// and search filter handlers and allows sharing of document code with that project.
#ifndef SHARED_HANDLERS
#include "laborator9MDI.h"
#endif

#include "laborator9MDIDoc.h"

#include <propkey.h>

#ifdef _DEBUG
#define new DEBUG_NEW
#endif

// Claborator9MDIDoc

IMPLEMENT_DYNCREATE(Claborator9MDIDoc, CDocument)

BEGIN_MESSAGE_MAP(Claborator9MDIDoc, CDocument)
END_MESSAGE_MAP()


// Claborator9MDIDoc construction/destruction

Claborator9MDIDoc::Claborator9MDIDoc() noexcept : m_carti(1)
{
}



void Claborator9MDIDoc::OnEditAdaugacarte() {
	m_carti++;
	UpdateAllViews(NULL);
}

void Claborator9MDIDoc::OnEditStergecarte() {
	if (m_carti > 0) m_carti--;
	UpdateAllViews(NULL);
}

Claborator9MDIDoc::~Claborator9MDIDoc()
{
}

BOOL Claborator9MDIDoc::OnNewDocument()
{
	if (!CDocument::OnNewDocument())
		return FALSE;

	// TODO: add reinitialization code here
	// (SDI documents will reuse this document)

	return TRUE;
}




// Claborator9MDIDoc serialization

void Claborator9MDIDoc::Serialize(CArchive& ar)
{
	if (ar.IsStoring())
	{
		// TODO: add storing code here
	}
	else
	{
		// TODO: add loading code here
	}
}

#ifdef SHARED_HANDLERS

// Support for thumbnails
void Claborator9MDIDoc::OnDrawThumbnail(CDC& dc, LPRECT lprcBounds)
{
	// Modify this code to draw the document's data
	dc.FillSolidRect(lprcBounds, RGB(255, 255, 255));

	CString strText = _T("TODO: implement thumbnail drawing here");
	LOGFONT lf;

	CFont* pDefaultGUIFont = CFont::FromHandle((HFONT) GetStockObject(DEFAULT_GUI_FONT));
	pDefaultGUIFont->GetLogFont(&lf);
	lf.lfHeight = 36;

	CFont fontDraw;
	fontDraw.CreateFontIndirect(&lf);

	CFont* pOldFont = dc.SelectObject(&fontDraw);
	dc.DrawText(strText, lprcBounds, DT_CENTER | DT_WORDBREAK);
	dc.SelectObject(pOldFont);
}

// Support for Search Handlers
void Claborator9MDIDoc::InitializeSearchContent()
{
	CString strSearchContent;
	// Set search contents from document's data.
	// The content parts should be separated by ";"

	// For example:  strSearchContent = _T("point;rectangle;circle;ole object;");
	SetSearchContent(strSearchContent);
}

void Claborator9MDIDoc::SetSearchContent(const CString& value)
{
	if (value.IsEmpty())
	{
		RemoveChunk(PKEY_Search_Contents.fmtid, PKEY_Search_Contents.pid);
	}
	else
	{
		CMFCFilterChunkValueImpl *pChunk = nullptr;
		ATLTRY(pChunk = new CMFCFilterChunkValueImpl);
		if (pChunk != nullptr)
		{
			pChunk->SetTextValue(PKEY_Search_Contents, value, CHUNK_TEXT);
			SetChunkValue(pChunk);
		}
	}
}

#endif // SHARED_HANDLERS

// Claborator9MDIDoc diagnostics

#ifdef _DEBUG
void Claborator9MDIDoc::AssertValid() const
{
	CDocument::AssertValid();
}

void Claborator9MDIDoc::Dump(CDumpContext& dc) const
{
	CDocument::Dump(dc);
}
#endif //_DEBUG


// Claborator9MDIDoc commands
