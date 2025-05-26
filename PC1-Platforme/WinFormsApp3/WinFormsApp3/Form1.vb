Public Class Form1

    Private Sub cmdSus_Click(sender As Object, e As EventArgs) Handles cmdSus.Click
        Timer1.Enabled = True
    End Sub

    Private Sub cmdStanga_Click(sender As Object, e As EventArgs) Handles cmdStanga.Click
        Timer2.Enabled = True
    End Sub


    Private Sub cmdJos_Click(sender As Object, e As EventArgs) Handles cmdJos.Click
        Timer3.Enabled = True
    End Sub

    Private Sub cmdDreapta_Click(sender As Object, e As EventArgs) Handles cmdDreapta.Click
        Timer4.Enabled = True
    End Sub

    Private Sub Timer1_Tick(sender As Object, e As EventArgs) Handles Timer1.Tick
        If picPinguini.Top > 0 Then
            picPinguini.Top -= 1
        Else
            Timer1.Enabled = False
        End If
    End Sub

    Private Sub Timer2_Tick(sender As Object, e As EventArgs) Handles Timer2.Tick
        If picPinguini.Left > 0 Then
            picPinguini.Left -= 1
        Else
            Timer2.Enabled = False
        End If
    End Sub

    Private Sub Timer3_Tick(sender As Object, e As EventArgs) Handles Timer3.Tick
        If picPinguini.Bottom < Me.ClientSize.Height Then
            picPinguini.Top += 1
        Else
            Timer3.Enabled = False
        End If
    End Sub

    Private Sub Timer4_Tick(sender As Object, e As EventArgs) Handles Timer4.Tick
        If picPinguini.Right < Me.ClientSize.Width Then
            picPinguini.Left += 1
        Else
            Timer4.Enabled = False
        End If
    End Sub

End Class
