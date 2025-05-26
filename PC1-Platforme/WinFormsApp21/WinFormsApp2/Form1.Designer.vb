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
        LstInitiala = New ListBox()
        LstPare = New ListBox()
        LstImpare = New ListBox()
        textNule = New TextBox()
        Button1 = New Button()
        Button2 = New Button()
        Label1 = New Label()
        SuspendLayout()
        ' 
        ' LstInitiala
        ' 
        LstInitiala.FormattingEnabled = True
        LstInitiala.ItemHeight = 15
        LstInitiala.Location = New Point(12, 12)
        LstInitiala.Name = "LstInitiala"
        LstInitiala.Size = New Size(120, 274)
        LstInitiala.TabIndex = 0
        ' 
        ' LstPare
        ' 
        LstPare.FormattingEnabled = True
        LstPare.ItemHeight = 15
        LstPare.Location = New Point(250, 12)
        LstPare.Name = "LstPare"
        LstPare.Size = New Size(120, 274)
        LstPare.TabIndex = 1
        ' 
        ' LstImpare
        ' 
        LstImpare.FormattingEnabled = True
        LstImpare.ItemHeight = 15
        LstImpare.Location = New Point(439, 12)
        LstImpare.Name = "LstImpare"
        LstImpare.Size = New Size(120, 274)
        LstImpare.TabIndex = 2
        ' 
        ' textNule
        ' 
        textNule.Location = New Point(391, 399)
        textNule.Name = "textNule"
        textNule.Size = New Size(100, 23)
        textNule.TabIndex = 3
        ' 
        ' Button1
        ' 
        Button1.Location = New Point(12, 327)
        Button1.Name = "Button1"
        Button1.Size = New Size(132, 23)
        Button1.TabIndex = 4
        Button1.Text = "Incarcare automata"
        Button1.UseVisualStyleBackColor = True
        ' 
        ' Button2
        ' 
        Button2.Location = New Point(391, 327)
        Button2.Name = "Button2"
        Button2.Size = New Size(168, 23)
        Button2.TabIndex = 5
        Button2.Text = "Selectare valori"
        Button2.UseVisualStyleBackColor = True
        ' 
        ' Label1
        ' 
        Label1.AutoSize = True
        Label1.Location = New Point(208, 402)
        Label1.Name = "Label1"
        Label1.Size = New Size(122, 15)
        Label1.TabIndex = 6
        Label1.Text = "Numar elemente nule"
        ' 
        ' Form1
        ' 
        AutoScaleDimensions = New SizeF(7F, 15F)
        AutoScaleMode = AutoScaleMode.Font
        ClientSize = New Size(800, 450)
        Controls.Add(Label1)
        Controls.Add(Button2)
        Controls.Add(Button1)
        Controls.Add(textNule)
        Controls.Add(LstImpare)
        Controls.Add(LstPare)
        Controls.Add(LstInitiala)
        Name = "Form1"
        Text = "Generare si selectare"
        ResumeLayout(False)
        PerformLayout()
    End Sub

    Friend WithEvents LstInitiala As ListBox
    Friend WithEvents LstPare As ListBox
    Friend WithEvents LstImpare As ListBox
    Friend WithEvents textNule As TextBox
    Friend WithEvents Button1 As Button
    Friend WithEvents Button2 As Button
    Friend WithEvents Label1 As Label

End Class
