Imports System.Windows.Forms.VisualStyles.VisualStyleElement.Button

Public Class Form1
    Dim tablou() As Integer
    Dim iNrElemente As Integer
    Dim temp As Integer
    Dim NrAleator As New Random()

    ' Generează și încarcă valori aleatorii în TextBox-uri
    Private Sub Button1_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles Button1.Click
        iNrElemente = GroupBox1.Controls.Count
        For i = 0 To iNrElemente - 1
            GroupBox1.Controls.Item(iNrElemente - i - 1).Text = NrAleator.Next(0, 10)
        Next

        ReDim tablou(iNrElemente - 1)
        For i = 0 To iNrElemente - 1
            tablou(iNrElemente - 1 - i) = Val(GroupBox1.Controls.Item(i).Text)
        Next
    End Sub

    Private Sub Button2_Click(sender As Object, e As EventArgs) Handles Button2.Click
        IncarcareValori()
        temp = tablou(iNrElemente - 1)
        For i = iNrElemente - 1 To 1 Step -1
            tablou(i) = tablou(i - 1)
        Next
        tablou(0) = temp
        PreluareValori()
    End Sub

    Private Sub Button4_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles Button4.Click
        IncarcareValori()
        temp = tablou(0)
        For i = 0 To iNrElemente - 2
            tablou(i) = tablou(i + 1)
        Next
        tablou(iNrElemente - 1) = temp
        PreluareValori()
    End Sub

    Private Sub IncarcareValori()
        iNrElemente = GroupBox1.Controls.Count
        ReDim tablou(iNrElemente - 1)
        For i = 0 To iNrElemente - 1
            tablou(iNrElemente - 1 - i) = Val(GroupBox1.Controls.Item(i).Text)
        Next
    End Sub


    Private Sub PreluareValori()
        For Each TextBox In GroupBox1.Controls
            TextBox.Text = ""
        Next
        For i = 0 To iNrElemente - 1
            GroupBox1.Controls.Item(iNrElemente - i - 1).Text = tablou(i)
        Next
    End Sub

    Private Sub Button3_Click(sender As Object, e As EventArgs) Handles Button3.Click
        End
    End Sub
End Class
