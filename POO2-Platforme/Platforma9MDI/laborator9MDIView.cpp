#include "pch.h"
#include "framework.h"
#ifndef SHARED_HANDLERS
#include "laborator9MDI.h"
#endif
#include "laborator9MDIDoc.h"
#include "laborator9MDIView.h"

#ifdef _DEBUG
#define new DEBUG_NEW
#endif

IMPLEMENT_DYNCREATE(Claborator9MDIView, CView)

BEGIN_MESSAGE_MAP(Claborator9MDIView, CView)
	ON_COMMAND(ID_FILE_PRINT, &CView::OnFilePrint)
	ON_COMMAND(ID_FILE_PRINT_DIRECT, &CView::OnFilePrint)
	ON_COMMAND(ID_FILE_PRINT_PREVIEW, &Claborator9MDIView::OnFilePrintPreview)
	ON_WM_CONTEXTMENU()
	ON_WM_RBUTTONUP()
END_MESSAGE_MAP()

Claborator9MDIView::Claborator9MDIView() noexcept {}
Claborator9MDIView::~Claborator9MDIView() {}

BOOL Claborator9MDIView::PreCreateWindow(CREATESTRUCT& cs)
{
	return CView::PreCreateWindow(cs);
}

void Claborator9MDIView::OnDraw(CDC* pDC)
{
	Claborator9MDIDoc* pDoc = GetDocument();
	ASSERT_VALID(pDoc);
	if (!pDoc) return;

	CBrush br(RGB(255, 255, 0)); // Galben
	CBrush* pOldBrush = pDC->SelectObject(&br);

	for (int i = 0; i < pDoc->GetCartiCount(); i++) {
		int y = 100 - 10 * i;
		pDC->Rectangle(40, y, 100, y - 30);
		pDC->Rectangle(40, y - 10, 100, y - 35);
	}
	pDC->SelectObject(pOldBrush);
}

void Claborator9MDIView::OnFilePrintPreview()
{
#ifndef SHARED_HANDLERS
	AFXPrintPreview(this);
#endif
}

BOOL Claborator9MDIView::OnPreparePrinting(CPrintInfo* pInfo)
{
	return DoPreparePrinting(pInfo);
}

void Claborator9MDIView::OnBeginPrinting(CDC* /*pDC*/, CPrintInfo* /*pInfo*/) {}
void Claborator9MDIView::OnEndPrinting(CDC* /*pDC*/, CPrintInfo* /*pInfo*/) {}

void Claborator9MDIView::OnRButtonUp(UINT /* nFlags */, CPoint point)
{
	ClientToScreen(&point);
	OnContextMenu(this, point);
}

void Claborator9MDIView::OnContextMenu(CWnd* /* pWnd */, CPoint point)
{
#ifndef SHARED_HANDLERS
	theApp.GetContextMenuManager()->ShowPopupMenu(IDR_POPUP_EDIT, point.x, point.y, this, TRUE);
#endif
}

#ifdef _DEBUG
void Claborator9MDIView::AssertValid() const { CView::AssertValid(); }
void Claborator9MDIView::Dump(CDumpContext& dc) const { CView::Dump(dc); }
Claborator9MDIDoc* Claborator9MDIView::GetDocument() const
{
	ASSERT(m_pDocument->IsKindOf(RUNTIME_CLASS(Claborator9MDIDoc)));
	return (Claborator9MDIDoc*)m_pDocument;
}
#endif