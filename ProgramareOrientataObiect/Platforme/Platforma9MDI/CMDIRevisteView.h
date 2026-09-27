#pragma once

class CMDIRevisteView : public CView
{
    DECLARE_DYNCREATE(CMDIRevisteView)

protected:
    CMDIRevisteView();
    virtual ~CMDIRevisteView();

public:
    virtual void OnDraw(CDC* pDC);


protected:
    DECLARE_MESSAGE_MAP()
};