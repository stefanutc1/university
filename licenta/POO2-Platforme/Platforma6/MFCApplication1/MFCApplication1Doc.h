// MFCApplication1Doc.h : interface of the CMFCApplication1Doc class
//
#pragma once

class CMFCApplication1Doc : public CDocument
{
protected: 
	CMFCApplication1Doc() noexcept;
	DECLARE_DYNCREATE(CMFCApplication1Doc)

	// Attributes
public:
	int GetDosareCount(); 

protected:
	int m_Doc; 

	// Operations
public:

	// Overrides
public:
	virtual BOOL OnNewDocument();
	virtual void Serialize(CArchive& ar);
	virtual void DeleteContents(); 
#ifdef SHARED_HANDLERS
	virtual void InitializeSearchContent();
	virtual void OnDrawThumbnail(CDC& dc, LPRECT lprcBounds);
#endif // SHARED_HANDLERS

	// Implementation
public:
	virtual ~CMFCApplication1Doc();
#ifdef _DEBUG
	virtual void AssertValid() const;
	virtual void Dump(CDumpContext& dc) const;
#endif

protected:

	// Generated message map functions
protected:
	DECLARE_MESSAGE_MAP()

#ifdef SHARED_HANDLERS
	// Helper function that sets search content for a Search Handler
	void SetSearchContent(const CString& value);
#endif // SHARED_HANDLERS
public:
	afx_msg void OnAdaugareDosar(); 
	afx_msg void OnStergeDosar();   
};