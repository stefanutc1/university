#pragma once
#include <afxwin.h>

class CMDIRevisteDoc : public CDocument
{
    DECLARE_DYNCREATE(CMDIRevisteDoc)

public:
    CMDIRevisteDoc(); 
    virtual ~CMDIRevisteDoc();

    int GetRevisteCount() { return m_nReviste; }

    afx_msg void OnEditAdaugarevista();
    afx_msg void OnEditStergerevista();

protected:
    int m_nReviste;

    DECLARE_MESSAGE_MAP()
};