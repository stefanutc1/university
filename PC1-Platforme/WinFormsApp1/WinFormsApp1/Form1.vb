Public Class Form1
    Dim iZecimi As Integer = 0
    Dim iSecunde As Integer = 0
    Dim iMinute As Integer = 0
    Dim iOra As Integer = 0

    Private Sub tmrCeas_Tick(sender As Object, e As EventArgs) Handles tmrCeas.Tick
        txtOra.Text = TimeOfDay.Hour.ToString("00")
        txtMinute.Text = TimeOfDay.Minute.ToString("00")
        txtSecunde.Text = TimeOfDay.Second.ToString("00")
        txtZecimi.Text = (TimeOfDay.Millisecond \ 10).ToString("00")
    End Sub

    Private Sub tmrCronometru_Tick(sender As Object, e As EventArgs) Handles tmrCronometru.Tick
        iZecimi += 1
        If iZecimi = 10 Then
            iSecunde += 1
            iZecimi = 0
            If iSecunde = 60 Then
                iMinute += 1
                iSecunde = 0
                If iMinute = 60 Then
                    iOra += 1
                    iMinute = 0
                End If
            End If
        End If

        txtZecimi.Text = iZecimi.ToString("00")
        txtSecunde.Text = iSecunde.ToString("00")
        prgSecunde.Value = iSecunde
        txtMinute.Text = iMinute.ToString("00")
        prgMinute.Value = iMinute
        txtOra.Text = iOra.ToString("00")
        prgOre.Value = iOra
    End Sub

    Private Sub btnCeas_Click(sender As Object, e As EventArgs) Handles btnCeas.Click
        tmrCeas.Enabled = True
        tmrCronometru.Enabled = False
    End Sub

    Private Sub btnStart_Click(sender As Object, e As EventArgs) Handles btnStart.Click
        tmrCeas.Enabled = False
        tmrCronometru.Enabled = True
    End Sub

    Private Sub btnReset_Click(sender As Object, e As EventArgs) Handles btnReset.Click
        tmrCeas.Enabled = False
        tmrCronometru.Enabled = False
        txtOra.Text = ""
        txtMinute.Text = ""
        txtSecunde.Text = ""
        txtZecimi.Text = ""
        prgOre.Value = 0
        prgMinute.Value = 0
        prgSecunde.Value = 0
        iZecimi = 0
        iSecunde = 0
        iMinute = 0
        iOra = 0
    End Sub
End Class