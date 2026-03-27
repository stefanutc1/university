#include "pch.h"
#include "framework.h"
#include "CMDIRevisteDoc.h" 
#include "CMDIRevisteView.h"


IMPLEMENT_DYNCREATE(CMDIRevisteView, CView)

BEGIN_MESSAGE_MAP(CMDIRevisteView, CView)
END_MESSAGE_MAP()

CMDIRevisteView::CMDIRevisteView() {}
CMDIRevisteView::~CMDIRevisteView() {}

void CMDIRevisteView::OnDraw(CDC* pDC)
{
    CMDIRevisteDoc* pDoc = (CMDIRevisteDoc*)m_pDocument;

    if (pDoc == NULL) return;

    CBrush br(RGB(0, 128, 32)); 
    CBrush* pOldBrush = pDC->SelectObject(&br);

    for (int i = 0; i < pDoc->GetRevisteCount(); i++)
    {
        int x = 40 + 20 * i;
        pDC->Rectangle(x, 40, x + 100, 90);
        pDC->TextOut(x + 5, 45, _T("&"));
    }

    pDC->SelectObject(pOldBrush);
}