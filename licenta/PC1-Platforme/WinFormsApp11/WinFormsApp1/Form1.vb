Public Class Form1
    Dim nrelemente As Integer

    Private Sub Button1_Click(sender As Object, e As EventArgs) Handles Button1.Click
        For i = 1 To 10
            ListBox1.Items.Add(i)
        Next
    End Sub

    Private Sub Button2_Click(sender As Object, e As EventArgs) Handles Button2.Click
        nrelemente = ListBox1.Items.Count - 1
        For i = ListBox1.Items.Count - 1 To 0 Step -1
            ListBox2.Items.Add(ListBox1.Items(i))
        Next
    End Sub

    Private Sub Button3_Click(sender As Object, e As EventArgs) Handles Button3.Click
        If ListBox1.SelectedItem IsNot Nothing Then
            ListBox2.Items.Add(ListBox1.SelectedItem)
        Else
            MessageBox.Show("Select an item")
        End If
    End Sub

    Private Sub Button4_Click(sender As Object, e As EventArgs) Handles Button4.Click
        ListBox2.Sorted = True
    End Sub
End Class