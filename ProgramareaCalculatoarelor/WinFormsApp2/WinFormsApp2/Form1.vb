Public Class Form1

    Private Sub Button1_Click(sender As Object, e As EventArgs) Handles Button1.Click
        txtPozitie.Text = InStr(txtSursa.Text, txtCautat.Text)
    End Sub

    Private Sub Button2_Click(sender As Object, e As EventArgs) Handles Button2.Click
        Dim spatiu As Integer = InStr(txtSursa.Text, " ")
        If spatiu > 0 Then
            txtNume.Text = Mid(txtSursa.Text, 1, spatiu - 1)
            txtPrenume.Text = Mid(txtSursa.Text, spatiu + 1)
        Else
            txtNume.Text = "Eroare"
            txtPrenume.Text = "Eroare"
        End If
    End Sub

End Class