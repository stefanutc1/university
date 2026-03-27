#pragma once

class Claborator9MDIDoc : public CDocument
{
protected:
    Claborator9MDIDoc() noexcept;
    DECLARE_DYNCREATE(Claborator9MDIDoc)

public:
    int GetCartiCount() { return m_carti; }

    // Operations
public:
    afx_msg void OnEditAdaugacarte();
    afx_msg void OnEditStergecarte();

protected:
    int m_carti;

    // Overrides
public:
    virtual BOOL OnNewDocument();
    virtual void Serialize(CArchive& ar);
#ifdef SHARED_HANDLERS
    virtual void InitializeSearchContent();
    virtual void OnDrawThumbnail(CDC& dc, LPRECT lprcBounds);
#endif 

    // Implementation
public:
    virtual ~Claborator9MDIDoc();
#ifdef _DEBUG
    virtual void AssertValid() const;
    virtual void Dump(CDumpContext& dc) const;
#endif

protected:
    DECLARE_MESSAGE_MAP()
};