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
        picPinguini = New PictureBox()
        cmdSus = New Button()
        cmdJos = New Button()
        cmdStanga = New Button()
        cmdDreapta = New Button()
        TextBox1 = New TextBox()
        TextBox2 = New TextBox()
        Label1 = New Label()
        Label2 = New Label()
        Button5 = New Button()
        Timer1 = New Timer(components)
        Timer2 = New Timer(components)
        Timer3 = New Timer(components)
        Timer4 = New Timer(components)
        CType(picPinguini, ComponentModel.ISupportInitialize).BeginInit()
        SuspendLayout()
        ' 
        ' picPinguini
        ' 
        picPinguini.Location = New Point(277, 32)
        picPinguini.Name = "picPinguini"
        picPinguini.Size = New Size(183, 50)
        picPinguini.TabIndex = 0
        picPinguini.TabStop = False
        ' 
        ' cmdSus
        ' 
        cmdSus.Location = New Point(275, 158)
        cmdSus.Name = "cmdSus"
        cmdSus.Size = New Size(75, 23)
        cmdSus.TabIndex = 1
        cmdSus.Text = "Sus"
        cmdSus.UseVisualStyleBackColor = True
        ' 
        ' cmdJos
        ' 
        cmdJos.Location = New Point(277, 230)
        cmdJos.Name = "cmdJos"
        cmdJos.Size = New Size(75, 23)
        cmdJos.TabIndex = 2
        cmdJos.Text = "Jos"
        cmdJos.UseVisualStyleBackColor = True
        ' 
        ' cmdStanga
        ' 
        cmdStanga.Location = New Point(196, 196)
        cmdStanga.Name = "cmdStanga"
        cmdStanga.Size = New Size(75, 23)
        cmdStanga.TabIndex = 3
        cmdStanga.Text = "Stanga"
        cmdStanga.UseVisualStyleBackColor = True
        ' 
        ' cmdDreapta
        ' 
        cmdDreapta.Location = New Point(360, 196)
        cmdDreapta.Name = "cmdDreapta"
        cmdDreapta.Size = New Size(75, 23)
        cmdDreapta.TabIndex = 4
        cmdDreapta.Text = "Dreapta"
        cmdDreapta.UseVisualStyleBackColor = True
        ' 
        ' TextBox1
        ' 
        TextBox1.Location = New Point(278, 294)
        TextBox1.Name = "TextBox1"
        TextBox1.Size = New Size(100, 23)
        TextBox1.TabIndex = 5
        ' 
        ' TextBox2
        ' 
        TextBox2.Location = New Point(277, 323)
        TextBox2.Name = "TextBox2"
        TextBox2.Size = New Size(100, 23)
        TextBox2.TabIndex = 6
        ' 
        ' Label1
        ' 
        Label1.AutoSize = True
        Label1.Location = New Point(210, 297)
        Label1.Name = "Label1"
        Label1.Size = New Size(61, 15)
        Label1.TabIndex = 7
        Label1.Text = "Pozitie OX"
        ' 
        ' Label2
        ' 
        Label2.AutoSize = True
        Label2.Location = New Point(210, 326)
        Label2.Name = "Label2"
        Label2.Size = New Size(61, 15)
        Label2.TabIndex = 8
        Label2.Text = "Pozitie OY"
        ' 
        ' Button5
        ' 
        Button5.Location = New Point(475, 373)
        Button5.Name = "Button5"
        Button5.Size = New Size(75, 23)
        Button5.TabIndex = 9
        Button5.Text = "Iesire"
        Button5.UseVisualStyleBackColor = True
        ' 
        ' Timer1
        ' 
        Timer1.Interval = 10
        ' 
        ' Timer2
        ' 
        Timer2.Interval = 10
        ' 
        ' Timer3
        ' 
        Timer3.Interval = 10
        ' 
        ' Timer4
        ' 
        Timer4.Interval = 10
        ' 
        ' Form1
        ' 
        AutoScaleDimensions = New SizeF(7F, 15F)
        AutoScaleMode = AutoScaleMode.Font
        ClientSize = New Size(800, 450)
        Controls.Add(Button5)
        Controls.Add(Label2)
        Controls.Add(Label1)
        Controls.Add(TextBox2)
        Controls.Add(TextBox1)
        Controls.Add(cmdDreapta)
        Controls.Add(cmdStanga)
        Controls.Add(cmdJos)
        Controls.Add(cmdSus)
        Controls.Add(picPinguini)
        Name = "Form1"
        Text = "Form1"
        CType(picPinguini, ComponentModel.ISupportInitialize).EndInit()
        ResumeLayout(False)
        PerformLayout()
    End Sub

    Friend WithEvents picPinguini As PictureBox
    Friend WithEvents cmdSus As Button
    Friend WithEvents cmdJos As Button
    Friend WithEvents cmdStanga As Button
    Friend WithEvents cmdDreapta As Button
    Friend WithEvents TextBox1 As TextBox
    Friend WithEvents TextBox2 As TextBox
    Friend WithEvents Label1 As Label
    Friend WithEvents Label2 As Label
    Friend WithEvents Button5 As Button
    Friend WithEvents Timer1 As Timer
    Friend WithEvents Timer2 As Timer
    Friend WithEvents Timer3 As Timer
    Friend WithEvents Timer4 As Timer

End Class
