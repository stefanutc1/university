Public Class Form1
    Dim tablou() As Integer
    Dim iNrElemente As Integer
    Dim a, b, temp As Integer

    Private Sub btnIncarcare_Click(sender As Object, e As EventArgs) Handles btnIncarcare.Click
        iNrElemente = GroupBox1.Controls.Count
        ReDim tablou(iNrElemente - 1)
        For i = 0 To iNrElemente - 1
            tablou(iNrElemente - 1 - i) = Val(GroupBox1.Controls.Item(i).Text)
        Next
    End Sub

    Private Sub btnInversare_Click(sender As Object, e As EventArgs) Handles btnInversare.Click
        IncarcareValori()
        a = tablou(Val(TextBox10.Text) - 1)
        b = tablou(Val(TextBox11.Text) - 1)
        temp = a
        a = b
        b = temp
        tablou(Val(TextBox10.Text) - 1) = a
        tablou(Val(TextBox11.Text) - 1) = b
        PreluareValori()
    End Sub

    Private Sub btnDeplasare_Click(sender As Object, e As EventArgs) Handles btnDeplasare.Click
        IncarcareValori()
        temp = tablou(0)
        For i = 0 To iNrElemente - 2
            tablou(i) = tablou(i + 1)
        Next
        tablou(iNrElemente - 1) = temp
        PreluareValori()
    End Sub

    Private Sub btnIncarcare1_Click(sender As Object, e As EventArgs) Handles btnIncarcare.Click
        Dim min As Integer
        For i = 0 To tablou.Length - 1
            min = tablou(i)
            For j = i + 1 To tablou.Length - 1
                If min >= tablou(j) Then
                    a = min
                    min = tablou(j)
                    tablou(j) = a
                    tablou(i) = min
                End If
            Next
        Next
        PreluareValori()
    End Sub

    Private Sub btnSortare_Click(sender As Object, e As EventArgs) Handles btnSortare.Click
        IncarcareValori()
        Array.Sort(tablou)
        ListBox1.Items.Clear()
        For i = 0 To iNrElemente - 1
            ListBox1.Items.Add(tablou(i))
        Next
        PreluareValori()
    End Sub

    Private Sub btnPreluare_Click(sender As Object, e As EventArgs) Handles btnPreluare.Click
        For Each TextBox In GroupBox1.Controls
            TextBox.Text = ""
        Next
        For i = 0 To iNrElemente - 1
            GroupBox1.Controls.Item(iNrElemente - i - 1).Text = tablou(i)
        Next
    End Sub

    Private Sub btnStergere_Click(sender As Object, e As EventArgs) Handles btnStergere.Click
        For Each TextBox In GroupBox1.Controls
            TextBox.Text = ""
        Next
    End Sub

    Private Sub btnIesire_Click(sender As Object, e As EventArgs) Handles btnIesire.Click
        End
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
End Class
