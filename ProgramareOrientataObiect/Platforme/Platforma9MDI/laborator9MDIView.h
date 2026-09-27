
// laborator9MDIView.h : interface of the Claborator9MDIView class
//

#pragma once


class Claborator9MDIView : public CView
{
protected: // create from serialization only
	Claborator9MDIView() noexcept;
	DECLARE_DYNCREATE(Claborator9MDIView)

// Attributes
public:
	Claborator9MDIDoc* GetDocument() const;

// Operations
public:

// Overrides
public:
	virtual void OnDraw(CDC* pDC);  // overridden to draw this view
	virtual BOOL PreCreateWindow(CREATESTRUCT& cs);
protected:
	virtual BOOL OnPreparePrinting(CPrintInfo* pInfo);
	virtual void OnBeginPrinting(CDC* pDC, CPrintInfo* pInfo);
	virtual void OnEndPrinting(CDC* pDC, CPrintInfo* pInfo);

// Implementation
public:
	virtual ~Claborator9MDIView();
#ifdef _DEBUG
	virtual void AssertValid() const;
	virtual void Dump(CDumpContext& dc) const;
#endif

protected:

// Generated message map functions
protected:
	afx_msg void OnFilePrintPreview();
	afx_msg void OnRButtonUp(UINT nFlags, CPoint point);
	afx_msg void OnContextMenu(CWnd* pWnd, CPoint point);
	DECLARE_MESSAGE_MAP()
};

#ifndef _DEBUG  // debug version in laborator9MDIView.cpp
inline Claborator9MDIDoc* Claborator9MDIView::GetDocument() const
   { return reinterpret_cast<Claborator9MDIDoc*>(m_pDocument); }
#endif

