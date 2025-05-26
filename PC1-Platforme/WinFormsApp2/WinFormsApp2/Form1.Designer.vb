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
        txtSursa = New TextBox()
        txtCautat = New TextBox()
        txtPozitie = New TextBox()
        Button1 = New Button()
        Button2 = New Button()
        txtNume = New TextBox()
        txtPrenume = New TextBox()
        Button3 = New Button()
        Label1 = New Label()
        Label2 = New Label()
        Label3 = New Label()
        Label4 = New Label()
        Label5 = New Label()
        SuspendLayout()
        ' 
        ' txtSursa
        ' 
        txtSursa.Location = New Point(63, 12)
        txtSursa.Name = "txtSursa"
        txtSursa.Size = New Size(100, 23)
        txtSursa.TabIndex = 0
        ' 
        ' txtCautat
        ' 
        txtCautat.Location = New Point(63, 50)
        txtCautat.Name = "txtCautat"
        txtCautat.Size = New Size(100, 23)
        txtCautat.TabIndex = 1
        ' 
        ' txtPozitie
        ' 
        txtPozitie.Location = New Point(63, 96)
        txtPozitie.Name = "txtPozitie"
        txtPozitie.Size = New Size(100, 23)
        txtPozitie.TabIndex = 2
        ' 
        ' Button1
        ' 
        Button1.Location = New Point(36, 157)
        Button1.Name = "Button1"
        Button1.Size = New Size(92, 23)
        Button1.TabIndex = 3
        Button1.Text = "Cauta"
        Button1.UseVisualStyleBackColor = True
        ' 
        ' Button2
        ' 
        Button2.Location = New Point(150, 157)
        Button2.Name = "Button2"
        Button2.Size = New Size(98, 23)
        Button2.TabIndex = 4
        Button2.Text = "Sterge"
        Button2.UseVisualStyleBackColor = True
        ' 
        ' txtNume
        ' 
        txtNume.Location = New Point(63, 203)
        txtNume.Name = "txtNume"
        txtNume.Size = New Size(100, 23)
        txtNume.TabIndex = 5
        ' 
        ' txtPrenume
        ' 
        txtPrenume.Location = New Point(63, 248)
        txtPrenume.Name = "txtPrenume"
        txtPrenume.Size = New Size(100, 23)
        txtPrenume.TabIndex = 6
        ' 
        ' Button3
        ' 
        Button3.Location = New Point(12, 314)
        Button3.Name = "Button3"
        Button3.Size = New Size(98, 23)
        Button3.TabIndex = 7
        Button3.Text = "Separa numele"
        Button3.UseVisualStyleBackColor = True
        ' 
        ' Label1
        ' 
        Label1.AutoSize = True
        Label1.Location = New Point(7, 15)
        Label1.Name = "Label1"
        Label1.Size = New Size(50, 15)
        Label1.TabIndex = 8
        Label1.Text = "Sir sursa"
        ' 
        ' Label2
        ' 
        Label2.AutoSize = True
        Label2.Location = New Point(1, 53)
        Label2.Name = "Label2"
        Label2.Size = New Size(56, 15)
        Label2.TabIndex = 9
        Label2.Text = "Sir cautat"
        ' 
        ' Label3
        ' 
        Label3.AutoSize = True
        Label3.Location = New Point(7, 99)
        Label3.Name = "Label3"
        Label3.Size = New Size(42, 15)
        Label3.TabIndex = 10
        Label3.Text = "Pozitie"
        ' 
        ' Label4
        ' 
        Label4.AutoSize = True
        Label4.Location = New Point(7, 206)
        Label4.Name = "Label4"
        Label4.Size = New Size(40, 15)
        Label4.TabIndex = 11
        Label4.Text = "Nume"
        ' 
        ' Label5
        ' 
        Label5.AutoSize = True
        Label5.Location = New Point(2, 251)
        Label5.Name = "Label5"
        Label5.Size = New Size(55, 15)
        Label5.TabIndex = 12
        Label5.Text = "Prenume"
        ' 
        ' Form1
        ' 
        AutoScaleDimensions = New SizeF(7F, 15F)
        AutoScaleMode = AutoScaleMode.Font
        ClientSize = New Size(800, 450)
        Controls.Add(Label5)
        Controls.Add(Label4)
        Controls.Add(Label3)
        Controls.Add(Label2)
        Controls.Add(Label1)
        Controls.Add(Button3)
        Controls.Add(txtPrenume)
        Controls.Add(txtNume)
        Controls.Add(Button2)
        Controls.Add(Button1)
        Controls.Add(txtPozitie)
        Controls.Add(txtCautat)
        Controls.Add(txtSursa)
        Name = "Form1"
        Text = "Cautare sir"
        ResumeLayout(False)
        PerformLayout()
    End Sub

    Friend WithEvents txtSursa As TextBox
    Friend WithEvents txtCautat As TextBox
    Friend WithEvents txtPozitie As TextBox
    Friend WithEvents Button1 As Button
    Friend WithEvents Button2 As Button
    Friend WithEvents txtNume As TextBox
    Friend WithEvents txtPrenume As TextBox
    Friend WithEvents Button3 As Button
    Friend WithEvents Label1 As Label
    Friend WithEvents Label2 As Label
    Friend WithEvents Label3 As Label
    Friend WithEvents Label4 As Label
    Friend WithEvents Label5 As Label

End Class
