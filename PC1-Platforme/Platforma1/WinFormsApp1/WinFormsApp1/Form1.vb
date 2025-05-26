Public Class Form1
    Private Sub btnAdunare_Click(sender As Object, e As EventArgs) Handles btnAdunare.Click
        Dim nr1 As Double = Val(txtNumar1.Text)
        Dim nr2 As Double = Val(txtNumar2.Text)
        txtRezultat.Text = (nr1 + nr2).ToString()
    End Sub

    Private Sub btnScadere_Click(sender As Object, e As EventArgs) Handles btnScadere.Click
        Dim nr1 As Double = Val(txtNumar1.Text)
        Dim nr2 As Double = Val(txtNumar2.Text)
        txtRezultat.Text = (nr1 - nr2).ToString()
    End Sub

    Private Sub btnInmultire_Click(sender As Object, e As EventArgs) Handles btnInmultire.Click
        Dim nr1 As Double = Val(txtNumar1.Text)
        Dim nr2 As Double = Val(txtNumar2.Text)
        txtRezultat.Text = (nr1 * nr2).ToString()
    End Sub

    Private Sub btnImpartire_Click(sender As Object, e As EventArgs) Handles btnImpartire.Click
        Dim nr1 As Double = Val(txtNumar1.Text)
        Dim nr2 As Double = Val(txtNumar2.Text)
        If nr2 <> 0 Then
            txtRezultat.Text = (nr1 / nr2).ToString()
        Else
            MsgBox("Nu se poate imparti la 0.")
        End If
    End Sub

    Private Sub btnStergere_Click(sender As Object, e As EventArgs) Handles btnStergere.Click
        txtNumar1.Clear()
        txtNumar2.Clear()
        txtRezultat.Clear()
    End Sub

    Private Sub btnIesire_Click(sender As Object, e As EventArgs) Handles btnIesire.Click
        Application.Exit()
    End Sub

    Private Sub Form1_Load(sender As Object, e As EventArgs) Handles MyBase.Load

    End Sub
End Class
