#include "pch.h"
#include "CMDIRevisteDoc.h"
#include "resource.h"


IMPLEMENT_DYNCREATE(CMDIRevisteDoc, CDocument)

BEGIN_MESSAGE_MAP(CMDIRevisteDoc, CDocument)
    ON_COMMAND(ID_EDIT_ADAUGAREvista, &CMDIRevisteDoc::OnEditAdaugarevista)
    ON_COMMAND(ID_EDIT_STERGEREvista, &CMDIRevisteDoc::OnEditStergerevista)
END_MESSAGE_MAP()

CMDIRevisteDoc::~CMDIRevisteDoc() {}

CMDIRevisteDoc::CMDIRevisteDoc() : m_nReviste(1) {}

void CMDIRevisteDoc::OnEditAdaugarevista() {
    m_nReviste++;
    UpdateAllViews(NULL);
}

void CMDIRevisteDoc::OnEditStergerevista() {
    if (m_nReviste > 0) m_nReviste--;
    UpdateAllViews(NULL);
}