<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()>
Partial Class Form1
    Inherits System.Windows.Forms.Form

    'Form overrides dispose to clean up the component list.
    <System.Diagnostics.DebuggerNonUserCode()>
    Protected Overrides Sub Dispose(disposing As Boolean)
        Try
            If disposing AndAlso components IsNot Nothing Then
                components.Dispose()
            End If
        Finally
            MyBase.Dispose(disposing)
        End Try
    End Sub

    'Required by the Windows Form Designer
    Private components As System.ComponentModel.IContainer

    'NOTE: The following procedure is required by the Windows Form Designer
    'It can be modified using the Windows Form Designer.  
    'Do not modify it using the code editor.
    <System.Diagnostics.DebuggerStepThrough()>
    Private Sub InitializeComponent()
        components = New ComponentModel.Container()
        lblOre = New Label()
        lblMinute = New Label()
        lblSecunde = New Label()
        lblZecimi = New Label()
        txtOra = New TextBox()
        txtMinute = New TextBox()
        txtSecunde = New TextBox()
        txtZecimi = New TextBox()
        btnStart = New Button()
        btnReset = New Button()
        btnCeas = New Button()
        prgOre = New ProgressBar()
        prgMinute = New ProgressBar()
        prgSecunde = New ProgressBar()
        tmrCeas = New Timer(components)
        Timer2 = New Timer(components)
        tmrCronometru = New Timer(components)
        SuspendLayout()
        ' 
        ' lblOre
        ' 
        lblOre.AutoSize = True
        lblOre.Location = New Point(12, 19)
        lblOre.Name = "lblOre"
        lblOre.Size = New Size(26, 15)
        lblOre.TabIndex = 0
        lblOre.Text = "Ore"
        ' 
        ' lblMinute
        ' 
        lblMinute.AutoSize = True
        lblMinute.Location = New Point(71, 19)
        lblMinute.Name = "lblMinute"
        lblMinute.Size = New Size(45, 15)
        lblMinute.TabIndex = 1
        lblMinute.Text = "Minute"
        ' 
        ' lblSecunde
        ' 
        lblSecunde.AutoSize = True
        lblSecunde.Location = New Point(140, 19)
        lblSecunde.Name = "lblSecunde"
        lblSecunde.Size = New Size(52, 15)
        lblSecunde.TabIndex = 2
        lblSecunde.Text = "Secunde"
        ' 
        ' lblZecimi
        ' 
        lblZecimi.AutoSize = True
        lblZecimi.Location = New Point(215, 19)
        lblZecimi.Name = "lblZecimi"
        lblZecimi.Size = New Size(43, 15)
        lblZecimi.TabIndex = 3
        lblZecimi.Text = "Zecimi"
        ' 
        ' txtOra
        ' 
        txtOra.Location = New Point(12, 46)
        txtOra.Name = "txtOra"
        txtOra.Size = New Size(40, 23)
        txtOra.TabIndex = 4
        ' 
        ' txtMinute
        ' 
        txtMinute.Location = New Point(71, 46)
        txtMinute.Name = "txtMinute"
        txtMinute.Size = New Size(45, 23)
        txtMinute.TabIndex = 5
        ' 
        ' txtSecunde
        ' 
        txtSecunde.Location = New Point(140, 46)
        txtSecunde.Name = "txtSecunde"
        txtSecunde.Size = New Size(52, 23)
        txtSecunde.TabIndex = 6
        ' 
        ' txtZecimi
        ' 
        txtZecimi.Location = New Point(215, 46)
        txtZecimi.Name = "txtZecimi"
        txtZecimi.Size = New Size(43, 23)
        txtZecimi.TabIndex = 7
        ' 
        ' btnStart
        ' 
        btnStart.Location = New Point(96, 87)
        btnStart.Name = "btnStart"
        btnStart.Size = New Size(140, 23)
        btnStart.TabIndex = 8
        btnStart.Text = "Pornire cronometru"
        btnStart.UseVisualStyleBackColor = True
        ' 
        ' btnReset
        ' 
        btnReset.Location = New Point(96, 126)
        btnReset.Name = "btnReset"
        btnReset.Size = New Size(140, 23)
        btnReset.TabIndex = 9
        btnReset.Text = "Reset"
        btnReset.UseVisualStyleBackColor = True
        ' 
        ' btnCeas
        ' 
        btnCeas.Location = New Point(96, 271)
        btnCeas.Name = "btnCeas"
        btnCeas.Size = New Size(140, 23)
        btnCeas.TabIndex = 10
        btnCeas.Text = "Afisare ceas"
        btnCeas.UseVisualStyleBackColor = True
        ' 
        ' prgOre
        ' 
        prgOre.Location = New Point(92, 191)
        prgOre.Maximum = 24
        prgOre.Name = "prgOre"
        prgOre.Size = New Size(56, 23)
        prgOre.TabIndex = 11
        ' 
        ' prgMinute
        ' 
        prgMinute.Location = New Point(173, 191)
        prgMinute.Maximum = 60
        prgMinute.Name = "prgMinute"
        prgMinute.Size = New Size(49, 23)
        prgMinute.TabIndex = 12
        ' 
        ' prgSecunde
        ' 
        prgSecunde.Location = New Point(243, 191)
        prgSecunde.Maximum = 60
        prgSecunde.Name = "prgSecunde"
        prgSecunde.Size = New Size(53, 23)
        prgSecunde.TabIndex = 13
        ' 
        ' tmrCeas
        ' 
        tmrCeas.Interval = 1000
        ' 
        ' Form1
        ' 
        AutoScaleDimensions = New SizeF(7F, 15F)
        AutoScaleMode = AutoScaleMode.Font
        ClientSize = New Size(800, 450)
        Controls.Add(prgSecunde)
        Controls.Add(prgMinute)
        Controls.Add(prgOre)
        Controls.Add(btnCeas)
        Controls.Add(btnReset)
        Controls.Add(btnStart)
        Controls.Add(txtZecimi)
        Controls.Add(txtSecunde)
        Controls.Add(txtMinute)
        Controls.Add(txtOra)
        Controls.Add(lblZecimi)
        Controls.Add(lblSecunde)
        Controls.Add(lblMinute)
        Controls.Add(lblOre)
        Name = "Form1"
        Text = "Form1"
        ResumeLayout(False)
        PerformLayout()
    End Sub

    Friend WithEvents lblOre As Label
    Friend WithEvents lblMinute As Label
    Friend WithEvents lblSecunde As Label
    Friend WithEvents lblZecimi As Label
    Friend WithEvents txtOra As TextBox
    Friend WithEvents txtMinute As TextBox
    Friend WithEvents txtSecunde As TextBox
    Friend WithEvents txtZecimi As TextBox
    Friend WithEvents btnStart As Button
    Friend WithEvents btnReset As Button
    Friend WithEvents btnCeas As Button
    Friend WithEvents prgOre As ProgressBar
    Friend WithEvents prgMinute As ProgressBar
    Friend WithEvents prgSecunde As ProgressBar
    Friend WithEvents tmrCeas As Timer
    Friend WithEvents Timer2 As Timer
    Friend WithEvents tmrCronometru As Timer

End Class
