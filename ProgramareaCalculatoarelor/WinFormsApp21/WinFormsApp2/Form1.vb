Public Class Form1
    Dim NrNule As Integer
    Dim NrAleator As New Random()

    Private Sub Button1_Click(sender As Object, e As EventArgs) Handles Button1.Click
        LstInitiala.Items.Clear()
        For i = 0 To 25
            LstInitiala.Items.Add(NrAleator.Next(0, 10))
        Next
    End Sub

    Private Sub Button2_Click(sender As Object, e As EventArgs) Handles Button2.Click
        NrNule = 0
        LstPare.Items.Clear()
        LstImpare.Items.Clear()

        For i = 0 To LstInitiala.Items.Count - 1
            Dim valoare As Integer = Convert.ToInt32(LstInitiala.Items(i))

            If valoare = 0 Then
                NrNule += 1
            ElseIf valoare Mod 2 = 0 Then
                LstPare.Items.Add(valoare)
            Else
                LstImpare.Items.Add(valoare)
            End If
        Next

        textNule.Text = NrNule.ToString()
    End Sub
End Class
